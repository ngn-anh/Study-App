import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationTypeDocument = NotificationType & Document;

@Schema({ collection: 'notification_types', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class NotificationType extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const NotificationTypeSchema =
  SchemaFactory.createForClass(NotificationType);
