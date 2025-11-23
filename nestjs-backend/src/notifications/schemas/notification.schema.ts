// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ collection: 'notifications', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'ReminderSchedule', required: false })
  schedule_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'NotificationType', required: true })
  noti_type_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ default: false })
  is_read: boolean;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
