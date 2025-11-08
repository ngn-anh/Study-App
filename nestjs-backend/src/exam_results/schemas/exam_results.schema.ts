import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExamResultDocument = ExamResult & Document;

@Schema({ collection: 'exam_results', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ExamResult {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
  exam_id: Types.ObjectId;

  @Prop()
  total_question: number;

  @Prop()
  total_correct: number;

  @Prop({ default: false })
  is_finish: boolean;

  @Prop()
  time_start: Date;

  @Prop()
  time_end: Date;

  @Prop({ default: null })
  deleted_at?: Date;
}

export const ExamResultSchema = SchemaFactory.createForClass(ExamResult);
