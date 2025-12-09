import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamsFilterDto, ExamStatus, SortOrder } from './dto/exams-filter.dto';
import { Exam, ExamDocument } from './schemas/exams.schema';
import {
  SubjectClass,
  SubjectClassDocument,
} from '../subjects-classes/schemas/subjects-classes.schema';
import { Subject, SubjectDocument } from 'src/subjects/schemas/subjects.schema';
import { Class, ClassDocument } from 'src/classes/schemas/classes.schema';
import { SubmitExamDto } from './dto/submit-exam.dto';
import {
  ExamResultAnswer,
  ExamResultAnswerDocument,
} from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import {
  ExamResult,
  ExamResultDocument,
} from 'src/exam_results/schemas/exam_results.schema';
import { GetExamRankDto } from './dto/get-exam-rank.dto';
import {
  Question,
  QuestionDocument,
} from 'src/questions/schemas/questions.schema';
import {
  LikeExam,
  LikeExamDocument,
} from 'src/like-exam/schemas/like-exam.schema';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(SubjectClass.name)
    private subjectClassModel: Model<SubjectClassDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(ExamResultAnswer.name)
    private examResultAnswerModel: Model<ExamResultAnswerDocument>,
    @InjectModel(ExamResult.name)
    private examResultModel: Model<ExamResultDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(LikeExam.name) private likeExamModel: Model<LikeExamDocument>,
  ) {}

  async getExams(filterDto: ExamsFilterDto) {
    const {
      status,
      name,
      sort,
      type,
      // currentClassCode,
      class_id,
      subjectCodes,
      page = 1,
      limit = 10,
      user_id,
    } = filterDto;

    const now = new Date();

    // --- (1) Lấy classId từ code ---
    let classId = class_id;
    // let classId: string | null = null;
    // if (currentClassCode) {
    //   const classDoc = await this.classModel
    //     .findOne({ code: currentClassCode })
    //     .select('_id')
    //     .lean();
    //   console.log("classDoc: ", classDoc);
    //   if (!classDoc) return { data: [], total: 0, page, limit };
    //   classId = classDoc._id.toString();
    // }

    // --- (2) Lấy subjectIds ---
    let subjectIds: string[] = [];
    if (subjectCodes?.length) {
      const subjectDocs = await this.subjectModel
        .find({ code: { $in: subjectCodes } })
        .select('_id')
        .lean();
      subjectIds = subjectDocs.map((s) => s._id.toString());
    }

    // --- (3) Lấy subjectClassIds ---
    let subjectClassIds: string[] = [];
    if (classId) {
      const query: any = { class_id: new Types.ObjectId(classId) };
      if (subjectIds.length) {
        query.subject_id = {
          $in: subjectIds.map((id) => new Types.ObjectId(id)),
        };
      }

      const subjectClassDocs = await this.subjectClassModel
        .find(query)
        .select('_id')
        .lean();

      subjectClassIds = subjectClassDocs.map((sc) => sc._id.toString());
      if (!subjectClassIds.length) return { data: [], total: 0, page, limit };
    }

    // --- (4) Lấy exam ---
    const examQuery: any = { deleted_at: null };
    if (subjectClassIds.length) {
      examQuery.subject_class_id = {
        $in: subjectClassIds.map((id) => new Types.ObjectId(id)),
      };
    }

    if (status === ExamStatus.ONGOING) {
      examQuery.start_date = { $lte: now };
      examQuery.end_date = { $gte: now };
    } else if (status === ExamStatus.UPCOMING) {
      examQuery.start_date = { $gt: now };
    }

    if (type) examQuery.type = type;
    if (name) examQuery.name = { $regex: name, $options: 'i' };

    let sortOption: any = {};

    if (sort === SortOrder.NEWEST) sortOption = { start_date: -1 };
    else if (sort === SortOrder.OLDEST) sortOption = { start_date: 1 };
    else sortOption = { start_date: -1 }; // mặc định newest
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.examModel
        .find(examQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'subject_class_id',
          select: '_id subject_id',
          populate: {
            path: 'subject_id',
            select: 'code name description',
          },
        })
        .lean(),
      this.examModel.countDocuments(examQuery),
    ]);

    // --- (5) Lấy danh sách exam_id ---
    const examIds = data.map((e) => e._id);

    // --- (6) Lấy số người tham gia cho mỗi exam ---
    // const results = await this.examResultModel.aggregate([
    //   { $match: { exam_id: { $in: examIds }, deleted_at: null } },
    //   { $group: { _id: '$exam_id', count: { $addToSet: '$user_id' } } },
    //   { $project: { _id: 1, participants: { $size: '$count' } } },
    // ]);
    const results = await this.examResultModel.aggregate([
      { $match: { exam_id: { $in: examIds }, deleted_at: null } },
      { $group: { _id: '$exam_id', participants: { $sum: 1 } } },
      { $project: { _id: 1, participants: 1 } },
    ]);

    // --- (7) Map exam_id → số lượng người tham gia ---
    const participantsMap = new Map<string, number>(
      results.map((r) => [r._id.toString(), r.participants]),
    );

    // --- (8) Nếu có user_id, lấy danh sách exam user đã làm ---
    let userDoneSet = new Set<string>();
    if (user_id && Types.ObjectId.isValid(user_id)) {
      const doneExams = await this.examResultModel
        .find({
          user_id: new Types.ObjectId(user_id),
          exam_id: { $in: examIds },
        })
        .distinct('exam_id');
      userDoneSet = new Set(doneExams.map((id) => id.toString()));
    }

    // --- (9) Lấy số lượng câu hỏi cho mỗi exam ---
    const questionsCount = await this.questionModel.aggregate([
      {
        $match: {
          exam_id: { $in: examIds },
          deleted_at: null,
        },
      },
      {
        $group: {
          _id: '$exam_id',
          numberQuestion: { $sum: 1 },
        },
      },
    ]);

    // --- (10) Map exam_id → số lượng câu hỏi ---
    const questionsMap = new Map<string, number>(
      questionsCount.map((q) => [q._id.toString(), q.numberQuestion]),
    );

    // --- (11) Lấy số lượng like cho mỗi exam ---
    const likesCount = await this.likeExamModel.aggregate([
      { $match: { exam_id: { $in: examIds } } },
      { $group: { _id: '$exam_id', total_like: { $sum: 1 } } },
    ]);

    // --- (12) Lấy danh sách exam user đã like ---
    let userLikedSet = new Set<string>();
    if (user_id && Types.ObjectId.isValid(user_id)) {
      const likedExams = await this.likeExamModel
        .find({
          user_id: new Types.ObjectId(user_id),
          exam_id: { $in: examIds },
        })
        .distinct('exam_id');
      userLikedSet = new Set(likedExams.map((id) => id.toString()));
    }

    const likesMap = new Map<string, number>(
      likesCount.map((l) => [l._id.toString(), l.total_like]),
    );

    // --- (13) Map dữ liệu trả về ---
    const mappedData = data.map((exam) => {
      const subjectClass = exam.subject_class_id as any; // vì populate -> Object
      const subject = subjectClass?.subject_id
        ? {
            code: subjectClass.subject_id.code,
            name: subjectClass.subject_id.name,
            description: subjectClass.subject_id.description,
          }
        : null;

      return {
        _id: exam._id,
        subject_class_id: exam.subject_class_id._id,
        name: exam.name,
        description: exam.description,
        type: exam.type,
        image: exam.image,
        difficulty: exam.difficulty,
        duration: exam.duration,
        start_date: exam.start_date,
        end_date: exam.end_date,
        total_download: exam.total_download || 0,
        created_at: (exam as any).created_at,
        updated_at: (exam as any).updated_at,
        subject,
        participants: participantsMap.get(exam._id.toString()) || 0,
        numberQuestion: questionsMap.get(exam._id.toString()) || 0,
        is_done: userDoneSet.has(exam._id.toString()),
        total_like: likesMap.get(exam._id.toString()) || 0,
        is_liked: userLikedSet.has(exam._id.toString()) ? 1 : 0,
      };
    });

    return { data: mappedData, total, page, limit };
  }

  async submitExam(dto: SubmitExamDto) {
    // Tính tổng đúng
    const total_correct = dto.answers.filter((a) => a.is_correct).length;
    const total_question = dto.answers.length;

    // Convert string ISO sang Date rõ ràng
    const timeStart = dto.time_start ? new Date(dto.time_start) : new Date();
    const timeEnd = dto.time_end ? new Date(dto.time_end) : new Date();

    // Lưu vào exam_result
    const examResult = await this.examResultModel.create({
      user_id: new Types.ObjectId(dto.user_id),
      exam_id: new Types.ObjectId(dto.exam_id),
      total_question,
      total_correct,
      is_finish: true,
      time_start: timeStart,
      time_end: timeEnd,
      deleted_at: null,
    });

    // Lọc bỏ các câu không có answer_question_id
    const validAnswers = dto.answers.filter(
      (a): a is { answer_question_id: string; is_correct: boolean } =>
        typeof a.answer_question_id === 'string' &&
        a.answer_question_id.trim() !== '',
    );

    // Lưu từng câu trả lời vào exam_result_answer
    const answersToSave = validAnswers.map((a) => ({
      exam_result_id: examResult._id,
      answer_question_id: new Types.ObjectId(a.answer_question_id),
      is_correct: a.is_correct,
      deleted_at: null,
    }));

    if (answersToSave.length > 0) {
      await this.examResultAnswerModel.insertMany(answersToSave);
    }

    return { examResultId: examResult._id, total_correct, total_question };
  }

  // async getExamInfo(examId: string) {
  //   if (!Types.ObjectId.isValid(examId)) {
  //     throw new NotFoundException('Exam not found');
  //   }

  //   const exam = await this.examModel.findById(examId).lean();
  //   if (!exam) throw new NotFoundException('Exam not found');

  //   // Lấy danh sách user_id duy nhất đã tham gia
  //   const uniqueUsers = await this.examResultModel.distinct('user_id', {
  //     exam_id: exam._id,
  //     deleted_at: null,
  //   });

  //   return {
  //     _id: exam._id,
  //     name: exam.name,
  //     image: exam.image,
  //     duration: exam.duration,
  //     participants: uniqueUsers.length,
  //   };
  // }

  async getExamInfo(examId: string, user_id?: string) {
    // ----- Kiểm tra ID hợp lệ -----
    if (!Types.ObjectId.isValid(examId)) {
      throw new NotFoundException('Exam not found');
    }

    // ----- Lấy exam + populate subject_class + subject -----
    const exam = await this.examModel
      .findOne({ _id: examId, deleted_at: null })
      .populate({
        path: 'subject_class_id',
        select: '_id subject_id',
        populate: {
          path: 'subject_id',
          select: 'code name description',
        },
      })
      .lean();

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    // ----- 1. Số người tham gia (unique user_id) -----
    // const participantsArray = await this.examResultModel.distinct('user_id', {
    //   exam_id: exam._id,
    //   deleted_at: null,
    // });
    const participantsArray = await this.examResultModel.find({
      exam_id: exam._id,
      deleted_at: null,
    });
    const participants = participantsArray.length;

    // ----- 2. Số câu hỏi -----
    const questionAgg = await this.questionModel.aggregate([
      { $match: { exam_id: exam._id, deleted_at: null } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);
    const numberQuestion = questionAgg[0]?.total ?? 0;

    // ----- 3. Tổng lượt like -----
    const likesAgg = await this.likeExamModel.aggregate([
      { $match: { exam_id: exam._id } },
      { $group: { _id: null, total_like: { $sum: 1 } } },
    ]);
    const total_like = likesAgg[0]?.total_like ?? 0;

    // ----- 4. Kiểm tra user đã làm bài chưa (is_done) -----
    let is_done = false;
    if (user_id && Types.ObjectId.isValid(user_id)) {
      const done = await this.examResultModel.findOne({
        exam_id: exam._id,
        user_id: new Types.ObjectId(user_id),
        deleted_at: null,
      });
      is_done = !!done;
    }

    // ----- 5. Kiểm tra người/ìno dùng đã like chưa (is_liked) -----
    let is_liked = 0;
    if (user_id && Types.ObjectId.isValid(user_id)) {
      const liked = await this.likeExamModel.findOne({
        exam_id: exam._id,
        user_id: new Types.ObjectId(user_id),
      });
      is_liked = liked ? 1 : 0;
    }

    // ----- 6. Định dạng trường subject (nếu có) -----
    const subjectClass = (exam.subject_class_id as any) ?? null;
    const subject = subjectClass?.subject_id
      ? {
          code: subjectClass.subject_id.code,
          name: subjectClass.subject_id.name,
          description: subjectClass.subject_id.description,
        }
      : null;

    // ----- 7. Kết quả trả về -----
    return {
      _id: exam._id,
      subject_class_id: subjectClass?._id ?? null,
      name: exam.name,
      description: exam.description,
      type: exam.type,
      image: exam.image,
      difficulty: exam.difficulty,
      duration: exam.duration,
      start_date: exam.start_date,
      end_date: exam.end_date,
      total_download: exam.total_download || 0,
      created_at: (exam as any).created_at,
      updated_at: (exam as any).updated_at,
      subject,
      participants,
      numberQuestion,
      is_done,
      total_like,
      is_liked,
    };
  }

  async getExamRank(dto: GetExamRankDto) {
    const { examId, userId, searchName } = dto;

    if (!Types.ObjectId.isValid(examId))
      throw new NotFoundException('Exam not found');

    // Lấy tất cả kết quả bài thi
    let results = await this.examResultModel
      .find({ exam_id: new Types.ObjectId(examId), deleted_at: null })
      .populate({ path: 'user_id', select: ['username', 'avatar'] })
      .lean();

    // Lọc bỏ kết quả không có user
    results = results.filter((r) => r.user_id);

    // Map dữ liệu
    const mapped = results.map((r) => {
      const durationMs =
        new Date(r.time_end).getTime() - new Date(r.time_start).getTime();
      const score =
        r.total_question > 0 ? (r.total_correct / r.total_question) * 100 : 0;
      const user = r.user_id as unknown as {
        _id: Types.ObjectId;
        username: string;
        avatar: string;
      };
      return {
        name: user.username,
        avatar: user.avatar,
        score: +score.toFixed(2),
        duration: durationMs,
        is_current_user: user._id.toString() === userId,
      };
    });

    // Sắp xếp: score giảm dần, duration tăng dần
    mapped.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.duration - b.duration;
    });

    // Thêm rank cố định
    let currentRank = 1;
    let lastScore: number | null = null;
    let lastDuration: number | null = null;
    const ranked = mapped.map((r, idx) => {
      if (!(lastScore === r.score && lastDuration === r.duration)) {
        currentRank = idx + 1;
        lastScore = r.score;
        lastDuration = r.duration;
      }
      return { rank: currentRank, ...r };
    });

    // Chỉ filter search sau khi đã tính rank
    const final = searchName
      ? ranked.filter((r) =>
          r.name.toLowerCase().includes(searchName.toLowerCase()),
        )
      : ranked;

    return final;
  }
}
