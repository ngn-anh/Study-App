// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationType, NotificationTypeDocument } from 'src/notification-types/schemas/notification-type.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationType.name) private notificationTypeModel: Model<NotificationTypeDocument>,
  ) {}

  // Lấy danh sách notifications theo code
  async getNotificationsByCode(code: string) {
    // Tìm notification_type theo code
        const notiType = await this.notificationTypeModel.findOne({ code, status: 'active' });
        if (!notiType) return { notification_type_name: '', notifications: [] };

        // Lấy danh sách notification thuộc type đó
        const notifications = await this.notificationModel
            .find({ noti_type_id: notiType._id, deleted_at: null })
            .select('schedule_id name description image is_read created_at') // chỉ các trường cần thiết
            .sort({ created_at: -1 });

        return {
            notification_type_name: notiType.name,
            notifications,
        };
    }

    async markAllReadByType(typeCode: string) {
      // Lấy _id của NotificationType
      const type = await this.notificationTypeModel.findOne({ code: typeCode });
      if (!type) return { success: false, message: 'Notification type not found' };

      // Update tất cả notifications chưa đọc theo type
      await this.notificationModel.updateMany(
        { noti_type_id: type._id, is_read: false },
        { $set: { is_read: true } }
      );

      return { success: true };
  }


  // Đánh dấu 1 notification đã đọc
  async markAsRead(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.notificationModel.findOneAndUpdate(
      { schedule_id: new Types.ObjectId(id), deleted_at: null },
      { is_read: true },
      { new: true }, // trả về document sau khi update
    );

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }

    return { success: true, data: updated };
  }
}
