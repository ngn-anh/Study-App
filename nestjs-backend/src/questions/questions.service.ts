import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/questions.schema';
import {
  AnswerQuestion,
  AnswerQuestionDocument,
} from 'src/answer-questions/schemas/answer-questions.schema';
import { Exam, ExamDocument } from 'src/exams/schemas/exams.schema';
import { shuffleArray } from 'src/utils';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateManyQuestionDto } from './dto/create-many-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(AnswerQuestion.name)
    private answerModel: Model<AnswerQuestionDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async findByExamId(
    examId: string,
    options?: {
      reverseQuestion?: boolean;
      reverseAnswer?: boolean;
    },
  ) {
    const { reverseQuestion = false, reverseAnswer = false } = options || {};

    // Lấy thông tin exam
    const exam = await this.examModel
      .findById(examId)
      .select('_id name duration type')
      .lean();

    if (!exam) {
      return null;
    }

    // Lấy câu hỏi
    const questions = await this.questionModel
      .find({ exam_id: new Types.ObjectId(examId), deleted_at: null })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    const questionIds = questions.map((q) => q._id);

    // Lấy đáp án
    const answers = await this.answerModel
      .find({ question_id: { $in: questionIds }, deleted_at: null })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    // Gộp question + answers
    let questionsWithAnswers = questions.map((q) => {
      let questionAnswers = answers.filter(
        (a) => a.question_id.toString() === q._id.toString(),
      );

      // Đảo thứ tự câu trả lời nếu reverseAnswer = true
      if (reverseAnswer) {
        questionAnswers = shuffleArray([...questionAnswers]);
      }

      return {
        ...q,
        answers: questionAnswers,
      };
    });

    // Đảo thứ tự câu hỏi nếu reverseQuestion = true
    if (reverseQuestion) {
      questionsWithAnswers = shuffleArray(questionsWithAnswers);
    }

    // Trả về exam + questions
    return {
      exam,
      questions: questionsWithAnswers,
    };
  }

  async findById(questionId: string) {
    // 1. Validate ObjectId
    if (!Types.ObjectId.isValid(questionId)) {
      return null;
    }

    /* =======================
     * 2. Lấy câu hỏi
     * ======================= */
    const question = await this.questionModel
      .findOne({
        _id: new Types.ObjectId(questionId),
        deleted_at: null,
      })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    if (!question) {
      return null;
    }

    const answers = await this.answerModel
      .find({
        question_id: question._id,
        deleted_at: null,
      })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    return {
      ...question,
      answers,
    };
  }

  async createQuestion(dto: CreateQuestionDto) {
    const {
      exam_id,
      description,
      difficulty,
      section,
      image,
      answers = [],
    } = dto;

    try {
      const createdQuestions = await this.questionModel.create([
        {
          exam_id: new Types.ObjectId(exam_id),
          description,
          difficulty,
          section,
          image,
        },
      ]);
      const questionDoc = createdQuestions[0];

      let answerDocs: AnswerQuestionDocument[] = [];
      if (answers.length > 0) {
        const answerInsert = answers.map((ans) => ({
          question_id: questionDoc._id,
          description: ans.description,
          image: ans.image,
          is_correct: ans.is_correct ?? false,
          explanation: ans.explanation,
        }));

        // insertMany trả về các document đã chèn (có _id)
        const answerDocs = await this.answerModel
          .insertMany(answerInsert)
          .then((docs) => docs as AnswerQuestionDocument[]);
      }

      // -------------------------------------------------
      // 3️⃣ Trả về kết quả
      // -------------------------------------------------
      return {
        question: questionDoc.toObject(),
        answers: answerDocs.map((doc) => doc.toObject()),
      };
    } catch (err) {
      // Ghi log lỗi để tiện debug, sau đó ném lỗi cho controller
      console.error('Create question error →', err);
      throw new InternalServerErrorException('Tạo câu hỏi thất bại');
    }
    // return dto;
  }

  async createManyQuestions(dto: CreateManyQuestionDto) {
    const { exam_id, questions } = dto;

    if (!questions || questions.length === 0) {
      throw new BadRequestException('Danh sách câu hỏi trống');
    }

    try {
      /** 1️⃣ Insert questions */
      const questionDocs = await this.questionModel.insertMany(
        questions.map((q) => ({
          exam_id: new Types.ObjectId(exam_id),
          description: q.description,
          difficulty: q.difficulty,
          section: q.section,
        })),
      );

      /** 2️⃣ Build answers */
      const answerInserts: Partial<AnswerQuestion>[] = [];

      questionDocs.forEach((questionDoc, index) => {
        const questionInput = questions[index];

        questionInput.answers?.forEach((ans) => {
          answerInserts.push({
            question_id: questionDoc._id as Types.ObjectId,
            description: ans.description,
            explanation: ans.explanation,
            is_correct: ans.is_correct ?? false,
          });
        });
      });

      /** 3️⃣ Insert answers */
      let answerDocs: AnswerQuestionDocument[] = [];
      if (answerInserts.length > 0) {
        answerDocs = (await this.answerModel.insertMany(
          answerInserts,
        )) as AnswerQuestionDocument[];
      }

      /** 4️⃣ Map question → answers */
      const result = questionDocs.map((q) => ({
        question: q.toObject(),
        answers: answerDocs
          .filter((a) => a.question_id?.toString() === q._id?.toString())
          .map((a) => a.toObject() as AnswerQuestion),
      }));

      return result;
    } catch (err) {
      console.error('Create many questions error →', err);
      throw new InternalServerErrorException('Import câu hỏi thất bại');
    }
  }

  async updateQuestion(questionId: string, dto: UpdateQuestionDto) {
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('Mã câu hỏi không hợp lệ');
    }

    // 1. Cập nhật câu hỏi
    const question = await this.questionModel.findByIdAndUpdate(
      { _id: questionId },
      {
        description: dto.description,
        difficulty: dto.difficulty,
        section: dto.section,
        ...(dto.image ? { image: dto.image } : {}),
      },
    );

    if (!question) {
      throw new BadRequestException('Không tồn tại câu hỏi');
    }

    if (!dto.answers) return { _id: questionId };

    const dbAnswers = await this.answerModel.find({
      question_id: question._id,
      deleted_at: null,
    });

    const dbAnswerMap = new Map(dbAnswers.map((a) => [a._id?.toString(), a]));

    const incomingIds = new Set<string>();

    // 3. Update hoặc create đáp án
    for (const ans of dto.answers) {
      if (ans._id && dbAnswerMap.has(ans._id)) {
        // UPDATE
        incomingIds.add(ans._id);

        await this.answerModel.findByIdAndUpdate(
          { _id: ans._id },
          {
            description: ans.description,
            explanation: ans.explanation,
            is_correct: ans.is_correct ?? false,
          },
        );
      } else {
        // INSERT NEW
        await this.answerModel.create({
          question_id: question._id,
          description: ans.description,
          explanation: ans.explanation,
          is_correct: ans.is_correct ?? false,
        });
      }
    }

    // 4. Xóa các đáp án bị xóa trên FE
    const toDeleteIds = dbAnswers
      .filter((a) => !incomingIds.has(a._id!.toString()))
      .map((a) => a._id);

    // if (toDeleteIds.length) {
    //   await this.answerModel.updateMany(
    //     { _id: { $in: toDeleteIds } },
    //     { deleted_at: new Date() },
    //   );
    // }

    if (toDeleteIds.length) {
      await this.answerModel.deleteMany({ _id: { $in: toDeleteIds } });
    }

    return { _id: questionId };
  }

  async softDeleteQuestion(questionId: string) {
    if (!Types.ObjectId.isValid(questionId)) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    const objectId = new Types.ObjectId(questionId);
    const now = new Date();

    // 1. Cập nhật câu hỏi
    const question = await this.questionModel.findByIdAndUpdate(
      { objectId, deleted_at: null },
      { deleted_at: now },
      { new: true },
    );

    if (!question) {
      throw new NotFoundException('Câu hỏi không tồn tại hoặc đã bị xóa');
    }

    // 2. Xóa mềm tất cả đáp án liên quan
    await this.answerModel.updateMany(
      { question_id: objectId, deleted_at: null },
      { deleted_at: now },
    );

    return {
      message: 'Xóa câu hỏi và câu trả lời thành công',
    };
  }

  async hardDeleteQuestion(questionId: string) {
    if (!Types.ObjectId.isValid(questionId)) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    const objectId = new Types.ObjectId(questionId);

    // 1. Xóa câu hỏi
    const question = await this.questionModel.findByIdAndDelete(objectId);

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi để xóa');
    }

    // 2. Xóa tất cả đáp án liên quan
    await this.answerModel.deleteMany({ question_id: objectId });

    return {
      message: 'Xóa câu hỏi và câu trả lời thành công',
    };
  }
}
