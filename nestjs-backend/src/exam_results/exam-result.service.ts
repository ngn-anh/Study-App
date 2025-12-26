import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamResultAnswer } from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import { ExamResult } from './schemas/exam_results.schema';
import { AnswerQuestion } from 'src/answer-questions/schemas/answer-questions.schema';
import { Question } from 'src/questions/schemas/questions.schema';

@Injectable()
export class ExamResultService {
  constructor(
    @InjectModel(ExamResult.name)
    private readonly examResultModel: Model<ExamResult>,
    @InjectModel(ExamResultAnswer.name)
    private readonly examResultAnswerModel: Model<ExamResultAnswer>,
    @InjectModel(AnswerQuestion.name)
    private readonly answerQuestionModel: Model<AnswerQuestion>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>,
  ) {}

  async getExamResultDetail(userId: string, examId: string) {
    // Tìm kết quả bài thi mới nhất của user
    const result = await this.examResultModel
      .findOne({
        user_id: new Types.ObjectId(userId),
        exam_id: new Types.ObjectId(examId),
        deleted_at: null,
      })
      .sort({ created_at: -1 })
      .lean();

    if (!result) {
      return { message: 'Chưa có kết quả cho bài thi này' };
    }

    // Lấy danh sách câu trả lời
    const answers = await this.examResultAnswerModel.find({
      exam_result_id: result._id,
      deleted_at: null,
    });

    const total_question = result.total_question;
    const total_correct = answers.filter((a) => a.is_correct).length;
    const total_wrong = answers.filter((a) => a.is_correct === false).length;
    const total_not_done = total_question - (total_correct + total_wrong);

    // Tính thời gian làm bài (giây)
    let durationSec = 0;
    let duration_text = '';

    if (result.time_start && result.time_end) {
      const start = new Date(result.time_start).getTime();
      const end = new Date(result.time_end).getTime();

      durationSec = Math.max(0, Math.floor((end - start) / 1000)); // tính theo giây

      const minutes = Math.floor(durationSec / 60);
      const seconds = durationSec % 60;

      duration_text = `${minutes}p${seconds.toString().padStart(2, '0')}s`;
    }
    return {
      exam_result_id: result._id,
      exam_id: result.exam_id,
      user_id: userId,
      total_question,
      total_correct,
      total_wrong,
      total_not_done,
      is_finish: result.is_finish,
      time_start: result.time_start,
      time_end: result.time_end,
      durationSec,
      duration_text,
    };
  }

  async getExamDetailResult(examResultId: string) {
    // 1. Lấy kết quả thi
    const examResult = await this.examResultModel.findById(examResultId).lean();
    if (!examResult) return { message: 'Không tìm thấy kết quả thi' };

    // 2. Lấy tất cả câu trả lời user
    let resultAnswers = await this.examResultAnswerModel
      .find({ exam_result_id: examResult._id })
      .lean();

    console.log('resultAnswers:', JSON.stringify(resultAnswers, null, 2));

    // 3. Lấy tất cả câu hỏi của bài thi
    const questions = await this.questionModel
      .find({ exam_id: examResult.exam_id, deleted_at: null })
      .lean();

    // 4. Lấy tất cả đáp án của các câu hỏi này
    const answerQuestions = await this.answerQuestionModel
      .find({
        question_id: { $in: questions.map((q) => q._id) },
        deleted_at: null,
      })
      .lean();

    const mappedQuestions = questions.map((q) => {
      const answers = answerQuestions
        .filter((aq) => aq.question_id.toString() === q._id.toString())
        .map((aq) => ({
          _id: aq._id,
          description: aq.description,
          is_correct: aq.is_correct,
          explanation: aq.explanation,
        }));

      const userAnswerObj = resultAnswers.find((ra) =>
        answers.some(
          (a) => a._id.toString() === ra.answer_question_id.toString(),
        ),
      );

      let userAnswerIndex: number | undefined = undefined;
      let correctAnswerIndex = answers.findIndex((a) => a.is_correct);

      if (userAnswerObj) {
        userAnswerIndex = answers.findIndex(
          (a) =>
            a._id.toString() === userAnswerObj.answer_question_id.toString(),
        );
      }

      const correctAnswerId = answers
        .filter((a) => a.is_correct)
        .map((a) => a._id);
      let userAnswerId: any[] | undefined = undefined;
      if (userAnswerObj) {
        const userAnswerTemp = answers.find(
          (a) =>
            a._id.toString() === userAnswerObj.answer_question_id.toString(),
        );
        userAnswerId = userAnswerTemp ? [userAnswerTemp._id] : []; // Trả về mảng ID
      }

      return {
        id: q._id,
        text: q.description,
        image: q.image || null,
        options: answers.map((a) => a.description),
        answers,
        correctAnswerIndex: correctAnswerIndex,
        userAnswerIndex: userAnswerIndex,
        correctAnswerId: correctAnswerId,
        userAnswerId: userAnswerId,
      };
    });

    return { questions: mappedQuestions };
  }

  async getAllExamResultDetail(userId: string, examId: string) {
    // Tìm 20 kết quả bài thi gần nhất
    const results = await this.examResultModel
      .find({
        user_id: new Types.ObjectId(userId),
        exam_id: new Types.ObjectId(examId),
        deleted_at: null,
      })
      .sort({ created_at: -1 })
      .limit(20)
      .lean();

    if (!results.length) {
      return [];
    }

    // Mảng để lưu kết quả cuối cùng
    const examResults = <any>[];

    // Xử lý TỪNG result trong mảng results
    for (const result of results) {
      // Lấy danh sách câu trả lời CHO result HIỆN TẠI
      const answers = await this.examResultAnswerModel.find({
        exam_result_id: result._id, // Lấy answers cho result này
        deleted_at: null,
      });

      const total_question = result.total_question;
      const total_correct = answers.filter((a) => a.is_correct).length;
      const total_wrong = answers.filter((a) => a.is_correct === false).length;
      const total_not_done = total_question - (total_correct + total_wrong);

      // Tính thời gian làm bài (giây) CHO result HIỆN TẠI
      let durationSec = 0;
      let duration_text = '';

      if (result.time_start && result.time_end) {
        const start = new Date(result.time_start).getTime();
        const end = new Date(result.time_end).getTime();

        durationSec = Math.max(0, Math.floor((end - start) / 1000));

        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;

        duration_text = `${minutes}p${seconds.toString().padStart(2, '0')}s`;
      }

      // Tạo object kết quả CHO result HIỆN TẠI
      const examResultItem = {
        exam_result_id: result._id,
        exam_id: result.exam_id,
        user_id: userId,
        total_question,
        total_correct,
        total_wrong,
        total_not_done,
        is_finish: result.is_finish,
        time_start: result.time_start,
        time_end: result.time_end,
        durationSec,
        duration_text,
      };

      // Thêm vào mảng kết quả
      examResults.push(examResultItem);
    }

    return examResults; // Trả về mảng 20 kết quả
  }
}
