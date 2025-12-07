// exams.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExamDocument = Exam & Document;

@Schema({ collection: 'exams', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Exam {
  @Prop({ type: Types.ObjectId, ref: 'SubjectClass', required: true })
  subject_class_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: [1, 2] })
  type: number; // 1 hoặc 2

  @Prop()
  image?: string;

  @Prop({ enum: [1, 2, 3] })
  difficulty?: number;

  @Prop({ type: Number })
  duration?: number; // phút

  @Prop()
  start_date?: Date;

  @Prop()
  end_date?: Date;

  @Prop({ type: Number, default: 25 })
  total_download?: number;

  @Prop()
  deleted_at?: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
