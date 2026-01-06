// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationType, NotificationTypeDocument } from 'src/notification-types/schemas/notification-type.schema';
import { ReminderSchedule, ReminderScheduleDocument } from 'src/reminder-schedules/schemas/reminder-schedule.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationType.name) private notificationTypeModel: Model<NotificationTypeDocument>,
    @InjectModel(ReminderSchedule.name) private reminderScheduleModel: Model<ReminderScheduleDocument>,
  ) {}

  // Lấy danh sách notifications theo code
  async getNotificationsByCode(code: string, user_id: string,  page: number, limit: number) {
    const notiType = await this.notificationTypeModel.findOne({ code, status: 'active' });
    if (!notiType) return { notification_type_name: '', notifications: [], total: 0 };

    // 1) Lấy danh sách schedule ids của user
    const schedules = await this.reminderScheduleModel
      .find({ user_id: new Types.ObjectId(user_id), deleted_at: null })
      .select('_id')
      .lean();

    const scheduleIds = schedules.map(s => s._id);
    if (scheduleIds.length === 0) {
      return { notification_type_name: notiType.name, notifications: [], total: 0 };
    }

    const skip = (page - 1) * limit;

    // 2) Lấy notifications có schedule_id trong danh sách đó và tính tổng
    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({
          noti_type_id: notiType._id,
          schedule_id: { $in: scheduleIds },
          deleted_at: null
        })
        .select('schedule_id name description image is_read created_at')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.notificationModel.countDocuments({
        noti_type_id: notiType._id,
        schedule_id: { $in: scheduleIds },
        deleted_at: null
      })
    ]);

    return {
      notification_type_name: notiType.name,
      notifications,
      total,
    };
  }


 async markAllReadByType(typeCode: string, user_id: string) {
  const type = await this.notificationTypeModel.findOne({ code: typeCode });
  if (!type) {
    return { success: false, message: "Notification type not found" };
  }

  // ép kiểu
  const typeId = new Types.ObjectId(type._id as any);

  const schedules = await this.reminderScheduleModel.find(
    { user_id: new Types.ObjectId(user_id), deleted_at: null },
    { _id: 1 }
  );

  const scheduleIds = schedules.map(s =>
    new Types.ObjectId(s._id as any)
  );

  const result = await this.notificationModel.updateMany(
    {
      noti_type_id: typeId,
      schedule_id: { $in: scheduleIds },
      is_read: false,
      deleted_at: null,
    },
    { $set: { is_read: true } }
  );

  return {
    success: true,
    matched: result.matchedCount,
    updated: result.modifiedCount,
  };
}




  // Đánh dấu 1 notification đã đọc
  async markAsRead(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), deleted_at: null },
      { is_read: true },
      { new: true }, // trả về document sau khi update
    );

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }

    return { success: true, data: updated };
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const doc = new this.notificationModel(data);
    return doc.save();
  }

  // Lấy tổng số notification chưa đọc của user
  async getUnreadCount(user_id: string): Promise<number> {
    // 1) Lấy danh sách schedule ids của user
    const schedules = await this.reminderScheduleModel
      .find({ user_id: new Types.ObjectId(user_id), deleted_at: null })
      .select('_id')
      .lean();

    const scheduleIds = schedules.map(s => s._id);
    if (scheduleIds.length === 0) {
      return 0;
    }

    // 2) Đếm số notification chưa đọc
    const unreadCount = await this.notificationModel.countDocuments({
      schedule_id: { $in: scheduleIds },
      is_read: false,
      deleted_at: null,
    });

    return unreadCount;
  }
}
