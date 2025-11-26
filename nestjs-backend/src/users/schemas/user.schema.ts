import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }  })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: null })
  phone?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null })
  full_name: string;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: false })
  class_id: Types.ObjectId;

  @Prop({ default: 1 })
  role: number;

  @Prop()
  refresh_token?: string;

  @Prop()
  token_expired?: number;

  @Prop()
  created_at?: Date;

  @Prop()
  updated_at?: Date;

  @Prop({ default: null })
  deleted_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
