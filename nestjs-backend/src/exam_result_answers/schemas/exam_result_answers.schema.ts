import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExamResultAnswerDocument = ExamResultAnswer & Document;

@Schema({ collection: 'exam_result_answers', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ExamResultAnswer {
  @Prop({ type: Types.ObjectId, ref: 'ExamResult', required: true })
  exam_result_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AnswerQuestion', required: true })
  answer_question_id: Types.ObjectId;

  @Prop({ default: false })
  is_correct: boolean;

  @Prop({ default: null })
  deleted_at?: Date;
}

export const ExamResultAnswerSchema = SchemaFactory.createForClass(ExamResultAnswer);
