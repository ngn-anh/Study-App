// src/notification-setting/schemas/notification-setting.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationSettingDocument = NotificationSetting & Document;

@Schema({collection: 'notification_settings', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class NotificationSetting {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user_id: Types.ObjectId;

  // Mở/tắt thông báo tổng
  @Prop({ default: false })
  is_open_noti: boolean;

  // Tắt tạm thời -> thời gian sau khi hết thì tự bật lại
  @Prop({ default: null })
  temporary_muted_until?: Date;

  // Lưu loại tắt tạm (30p, 1h, 8h,...)
  @Prop({ default: null })
  temporary_muted_type?: string;

  @Prop()
  created_at?: Date;

  @Prop()
  updated_at?: Date;
}

export const NotificationSettingSchema =
  SchemaFactory.createForClass(NotificationSetting);
