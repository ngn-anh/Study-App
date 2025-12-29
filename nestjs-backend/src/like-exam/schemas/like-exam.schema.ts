import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeExamDocument = LikeExam & Document;

@Schema({ collection: 'like_exams', timestamps: true })
export class LikeExam {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
  exam_id: Types.ObjectId;
}

export const LikeExamSchema = SchemaFactory.createForClass(LikeExam);

// Tạo compound index để đảm bảo mỗi user chỉ like 1 exam 1 lần
LikeExamSchema.index({ user_id: 1, exam_id: 1 }, { unique: true });
