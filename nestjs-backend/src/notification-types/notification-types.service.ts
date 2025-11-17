import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationType } from './schemas/notification-type.schema';
import { Notification } from 'src/notifications/schemas/notification.schema';
import { ReminderSchedule } from 'src/reminder-schedules/schemas/reminder-schedule.schema';


@Injectable()
export class NotificationTypesService {
  constructor(
    @InjectModel(NotificationType.name)
    private readonly notificationTypeModel: Model<NotificationType>,

    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,

    @InjectModel(ReminderSchedule.name)
    private readonly reminderScheduleModel: Model<ReminderSchedule>,
  ) {}

  async findAll(user_id: string) {
    // 1. Lấy danh sách loại thông báo
    const types = await this.notificationTypeModel
      .find(
        { status: 'active', deleted_at: null },
        { created_at: 0, updated_at: 0, deleted_at: 0, __v: 0 },
      )
      .sort({ name: 1 })
      .lean();

    // 2. Lấy danh sách schedule_id theo user_id
    const schedules = await this.reminderScheduleModel.find(
      { user_id: new Types.ObjectId(user_id), deleted_at: null },
      { _id: 1 }
    );

    const scheduleIds = schedules.map((s) => s._id);

    // Nếu user không có schedule thì unread = 0 hết
    if (scheduleIds.length === 0) {
      return types.map(t => ({ ...t, unread_count: 0 }));
    }

    // 3. Aggregate thông báo chưa đọc theo schedule + type
    const unreadCounts = await this.notificationModel.aggregate([
      {
        $match: {
          schedule_id: { $in: scheduleIds },
          is_read: false,
          deleted_at: null,
        },
      },
      {
        $group: {
          _id: '$noti_type_id',
          unread_count: { $sum: 1 },
        },
      },
    ]);

    const unreadMap = new Map(
      unreadCounts.map((u) => [u._id.toString(), u.unread_count]),
    );

    // 4. Gắn unread_count vào từng type
    return types.map((t) => ({
      ...t,
      unread_count: unreadMap.get(t._id.toString()) || 0,
    }));
  }

  async findByCode(code: string) {
    return this.notificationTypeModel.findOne({ code });
  }
}
