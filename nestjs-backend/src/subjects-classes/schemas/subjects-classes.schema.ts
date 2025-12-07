import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubjectClassDocument = SubjectClass & Document;

@Schema({ collection: 'subjects_classes', timestamps: true })
export class SubjectClass {
  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subject_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  class_id: Types.ObjectId;
}

export const SubjectClassSchema = SchemaFactory.createForClass(SubjectClass);
