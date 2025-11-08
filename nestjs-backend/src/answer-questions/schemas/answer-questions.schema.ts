import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnswerQuestionDocument = AnswerQuestion & Document;

@Schema({
  collection: 'answer_questions',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class AnswerQuestion {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  question_id: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop()
  image?: string;

  @Prop({ default: false })
  is_correct: boolean;

  @Prop()
  explanation?: string;

  @Prop()
  deleted_at?: Date;
}

export const AnswerQuestionSchema = SchemaFactory.createForClass(AnswerQuestion);
