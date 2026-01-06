// src/answers/answers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnswerQuestion, AnswerQuestionDocument } from './schemas/answer-questions.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
// import { Answer, AnswerDocument } from './schemas/answer.schema';
// import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswersService {
    constructor(
        @InjectModel(AnswerQuestion.name) private readonly answerModel: Model<AnswerQuestionDocument>,
    ) { }

    /** Tạo mới đáp án */
    async create(dto: CreateAnswerDto) {
        const created = await this.answerModel.create({
            ...dto,
            // question_id: new Types.ObjectId(dto.question_id),
        });
        return created.toObject();
    }

    // /** Lấy tất cả đáp án của 1 câu hỏi (không tính đã xóa) */
    // async findByQuestionId(questionId: string) {
    //     const answers = await this.answerModel
    //         .find({ question_id: new Types.ObjectId(questionId), deleted_at: { $exists: false } })
    //         .lean();
    //     return answers;
    // }

    // /** Cập nhật 1 đáp án */
    // async update(id: string, dto: Partial<CreateAnswerDto>) {
    //     const updated = await this.answerModel.findByIdAndUpdate(
    //         id,
    //         { $set: dto },
    //         { new: true },
    //     );
    //     if (!updated) throw new NotFoundException('Answer not found');
    //     return updated.toObject();
    // }

    // /** Soft‑delete */
    // async softDelete(id: string) {
    //     const res = await this.answerModel.findByIdAndUpdate(
    //         id,
    //         { $set: { deleted_at: new Date() } },
    //     );
    //     if (!res) throw new NotFoundException('Answer not found');
    //     return { success: true };
    // }

    // /** Hard delete (nếu cần) */
    // async hardDelete(id: string) {
    //     await this.answerModel.findByIdAndDelete(id);
    //     return { success: true };
    // }
}