import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  description?: string;

  @Prop({ type: Date })
  deleted_at?: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
