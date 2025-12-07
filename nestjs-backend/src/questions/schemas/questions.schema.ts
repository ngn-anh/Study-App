import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({
  collection: 'questions',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
  exam_id: Types.ObjectId;

  @Prop()
  image?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number })
  difficulty?: number;

  @Prop({ default: 1 })
  section: number;

  @Prop()
  deleted_at?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
