import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({collection: 'roles',  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})
export class Role {
  @Prop({ required: true, unique: true })
  code: string; // admin, staff

  @Prop({ required: true })
  name: string; // Admin, Nhân viên

  @Prop({ default: null })
  description?: string;

  @Prop()
  deleted_at?: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
