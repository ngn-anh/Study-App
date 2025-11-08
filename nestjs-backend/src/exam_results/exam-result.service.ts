import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamResultAnswer } from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import { ExamResult } from './schemas/exam_results.schema';


@Injectable()
export class ExamResultService {
  constructor(
    @InjectModel(ExamResult.name)
    private readonly examResultModel: Model<ExamResult>,
    @InjectModel(ExamResultAnswer.name)
    private readonly examResultAnswerModel: Model<ExamResultAnswer>,
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
    const total_correct = answers.filter(a => a.is_correct).length;
    const total_wrong = answers.filter(a => a.is_correct === false).length;
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

        duration_text = `${minutes}p${seconds.toString().padStart(2, "0")}s`;

    }
    return {
      exam_result_id: result._id,
      exam_id: result.exam_id,
      total_question,
      total_correct,
      total_wrong,
      total_not_done,
      durationSec,
      duration_text,
    };
  }
}
