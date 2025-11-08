import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamsFilterDto, ExamStatus, SortOrder } from './dto/exams-filter.dto';
import { Exam, ExamDocument } from './schemas/exams.schema';
import { SubjectClass, SubjectClassDocument } from '../subject-classes/schemas/subject-class.schema';
import { Subject, SubjectDocument } from 'src/subjects/schema/subjects.schema';
import { Class, ClassDocument } from 'src/classes/schemas/classes.schema';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { ExamResultAnswer, ExamResultAnswerDocument } from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import { ExamResult, ExamResultDocument } from 'src/exam_results/schemas/exam_results.schema';


@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(SubjectClass.name) private subjectClassModel: Model<SubjectClassDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(ExamResultAnswer.name) private examResultAnswerModel: Model<ExamResultAnswerDocument>,
    @InjectModel(ExamResult.name) private examResultModel: Model<ExamResultDocument>
  ) {}

 async getExams(filterDto: ExamsFilterDto) {
  const {
    status,
    name,
    sort,
    type,
    currentClassCode,
    subjectCodes,
    page = 1,
    limit = 10,
    user_id, 
  } = filterDto;

  const now = new Date();

  // --- (1) Lấy classId từ code ---
  let classId: string | null = null;
  if (currentClassCode) {
    const classDoc = await this.classModel
      .findOne({ code: currentClassCode })
      .select('_id')
      .lean();
    if (!classDoc) return { data: [], total: 0, page, limit };
    classId = classDoc._id.toString();
  }

  // --- (2) Lấy subjectIds ---
  let subjectIds: string[] = [];
  if (subjectCodes?.length) {
    const subjectDocs = await this.subjectModel
      .find({ code: { $in: subjectCodes } })
      .select('_id')
      .lean();
    subjectIds = subjectDocs.map(s => s._id.toString());
  }

  // --- (3) Lấy subjectClassIds ---
  let subjectClassIds: string[] = [];
  if (classId) {
    const query: any = { class_id: new Types.ObjectId(classId) };
    if (subjectIds.length) {
      query.subject_id = { $in: subjectIds.map(id => new Types.ObjectId(id)) };
    }

    const subjectClassDocs = await this.subjectClassModel
      .find(query)
      .select('_id')
      .lean();

    subjectClassIds = subjectClassDocs.map(sc => sc._id.toString());
    if (!subjectClassIds.length) return { data: [], total: 0, page, limit };
  }

  // --- (4) Lấy exam ---
  const examQuery: any = {};
  if (subjectClassIds.length) {
    examQuery.subject_class_id = {
      $in: subjectClassIds.map(id => new Types.ObjectId(id)),
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
          select: 'code name',
        },
      })
      .lean(),
    this.examModel.countDocuments(examQuery),
  ]);

  // --- (5) Lấy danh sách exam_id ---
  const examIds = data.map(e => e._id);

  // --- (6) Lấy số người tham gia cho mỗi exam ---
  const results = await this.examResultModel.aggregate([
    { $match: { exam_id: { $in: examIds }, deleted_at: null } },
    { $group: { _id: '$exam_id', count: { $addToSet: '$user_id' } } },
    { $project: { _id: 1, participants: { $size: '$count' } } },
  ]);

  // --- (7) Map exam_id → số lượng người tham gia ---
  const participantsMap = new Map<string, number>(
    results.map(r => [r._id.toString(), r.participants])
  );

  // --- (8) Nếu có user_id, lấy danh sách exam user đã làm ---
  let userDoneSet = new Set<string>();
  if (user_id && Types.ObjectId.isValid(user_id)) {
    const doneExams = await this.examResultModel
      .find({ user_id: new Types.ObjectId(user_id), exam_id: { $in: examIds } })
      .distinct('exam_id');
    userDoneSet = new Set(doneExams.map(id => id.toString()));
  }

  // --- (9) Map dữ liệu trả về ---
  const mappedData = data.map(exam => {
    const subjectClass = exam.subject_class_id as any; // vì populate -> Object
    const subject = subjectClass?.subject_id
      ? {
          code: subjectClass.subject_id.code,
          name: subjectClass.subject_id.name,
        }
      : null;

    return {
      _id: exam._id,
      name: exam.name,
      image: exam.image,
      duration: exam.duration,
      start_date: exam.start_date,
      end_date: exam.end_date,
      subject,
      participants: participantsMap.get(exam._id.toString()) || 0,
      is_done: userDoneSet.has(exam._id.toString()),
    };
  });

  return { data: mappedData, total, page, limit };
}


  async submitExam(dto: SubmitExamDto) {
    // Tính tổng đúng
    const total_correct = dto.answers.filter(a => a.is_correct).length;
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
        typeof a.answer_question_id === "string" && a.answer_question_id.trim() !== ""
    );

    // Lưu từng câu trả lời vào exam_result_answer
    const answersToSave = validAnswers.map(a => ({
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

  async getExamInfo(examId: string) {
    if (!Types.ObjectId.isValid(examId)) {
      throw new NotFoundException('Exam not found');
    }

    const exam = await this.examModel.findById(examId).lean();
    if (!exam) throw new NotFoundException('Exam not found');

    // Lấy danh sách user_id duy nhất đã tham gia
    const uniqueUsers = await this.examResultModel.distinct('user_id', {
      exam_id: exam._id,
      deleted_at: null,
    });

    return {
      _id: exam._id,
      name: exam.name,
      image: exam.image,
      duration: exam.duration,
      participants: uniqueUsers.length,
    };
  }
}
