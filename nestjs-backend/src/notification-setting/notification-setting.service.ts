// src/notification-setting/notification-setting.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NotificationSetting,
  NotificationSettingDocument,
} from './schemas/notification-setting.schema';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class NotificationSettingService {
  constructor(
    @InjectModel(NotificationSetting.name)
    private notificationSettingModel: Model<NotificationSettingDocument>,
    @InjectQueue('notification') private notificationQueue: Queue
  ) {}

  async getByUser(user_id: string) {
    let setting = await this.notificationSettingModel.findOne({
      user_id: new Types.ObjectId(user_id),
    });

    if (!setting) {
      // lần đầu: tạo default
      setting = await this.notificationSettingModel.create({
        user_id: new Types.ObjectId(user_id),
      });
    }

    return setting;
  }

  async updateByUser(user_id: string, dto: UpdateNotificationSettingDto) {
    const setting = await this.notificationSettingModel.findOneAndUpdate(
      { user_id: new Types.ObjectId(user_id) },
      { $set: dto },
      { new: true, upsert: true },
    );

    return setting;
  }

  // Xóa job restore cũ nếu tồn tại
  async removeExistingRestoreJob(user_id: string) {
    const jobId = `restore_${user_id}`;
    const oldJob = await this.notificationQueue.getJob(jobId);
    if (oldJob) {
      await oldJob.remove();
    }
  }

  // Khi user tắt tạm:
    async muteTemporarily(user_id: string, durationMs: number, type: string) {
        const until = new Date(Date.now() + durationMs).toISOString();
        
        await this.updateByUser(user_id, {
            is_open_noti: false,
            temporary_muted_until: until,
            temporary_muted_type: type,
        });

        const jobId = `restore_${user_id}`;

       // Xóa job cũ nếu có
        await this.removeExistingRestoreJob(user_id);

        // Tạo job mới nếu durationMs !== null
        if (durationMs) {
            await this.notificationQueue.add(
            'restore',
            { user_id },
            { delay: durationMs, jobId } // dùng jobId cố định
            );
        }

    }

    // Xử lý bật/tắt thông báo (gọi khi user bật ON hoặc tắt OFF vĩnh viễn)
  async toggleNotification(user_id: string, is_open_noti: boolean) {
    // Xóa job cũ nếu có
    await this.removeExistingRestoreJob(user_id);

    // Cập nhật DB
    return this.updateByUser(user_id, {
      is_open_noti,
      temporary_muted_until: null,
      temporary_muted_type: null,
    });
  }
}
