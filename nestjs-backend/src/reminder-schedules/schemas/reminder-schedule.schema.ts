import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReminderScheduleDocument = ReminderSchedule & Document;

@Schema({ collection: 'reminder_schedules',  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class ReminderSchedule {
  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  note: string;

  @Prop({ required: true })
  due_date: Date;

  @Prop({ required: true })
  due_time: string;

  @Prop({ required: true })
  remind_date: Date;

  @Prop({ required: true })
  remind_time: string;

  @Prop({ default: 'none' })
  repeat_mode: string;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;

  @Prop({ type: String })
  fcm_token?: string;

}

export const ReminderScheduleSchema = SchemaFactory.createForClass(ReminderSchedule);
