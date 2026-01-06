// src/reminder/reminder.processor.ts
import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTypesService } from 'src/notification-types/notification-types.service';
import { Types } from 'mongoose';
import { sendFCMNotification } from 'src/firebase-admin'; // 🔹 dùng Admin SDK
import { NotificationSettingService } from 'src/notification-setting/notification-setting.service';

@Processor('reminderQueue')
export class ReminderProcessor {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationTypesService: NotificationTypesService,
    private readonly notificationSettingService: NotificationSettingService,
  ) {}

  @Process('sendReminder')
  async handleReminder(job: Job) {
    const { schedule } = job.data;
    console.log('schedule', schedule);
    console.log('ReminderProcessor job running for:', schedule.title);

    const setting = await this.notificationSettingService.getByUser(schedule.user_id);
    // Nếu user tắt thông báo
    if (setting.is_open_noti === false) return;

    //  Tìm loại thông báo "REMINDER"
    const reminderType = (await this.notificationTypesService.findByCode('REMINDER')) as
      | { _id: Types.ObjectId }
      | null;

    // Lưu notification vào MongoDB
    const newNoti= await this.notificationsService.create({
      schedule_id: new Types.ObjectId(schedule._id),
      noti_type_id: reminderType?._id,
      name: schedule.title,
      description: schedule.note,
      image: undefined,
      is_read: false,
    });

    //  Gửi FCM notification qua Firebase Admin SDK
    if (schedule.fcm_token) {
      try {
        await sendFCMNotification(
          schedule.fcm_token,
          schedule.title,
          schedule.note || 'Thông báo đến',
          {
            notiId: (newNoti as any)._id.toString(),
            scheduleId: schedule._id.toString(),
            type: 'REMINDER',
          }
          // image có thể truyền nếu cần, ví dụ schedule.image
        );
        console.log('FCM notification sent for schedule', schedule._id);
      } catch (error) {
        console.error(' Failed to send FCM notification:', error);
      }
    } else {
      console.warn('No FCM token found for schedule', schedule._id);
    }
  }
}
