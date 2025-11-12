import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationType } from './schemas/notification-type.schema';
import { Notification } from 'src/notifications/schemas/notification.schema';


@Injectable()
export class NotificationTypesService {
  constructor(
    @InjectModel(NotificationType.name)
    private readonly notificationTypeModel: Model<NotificationType>,

    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

 async findAll() {
    // Lấy danh sách loại thông báo
    const types = await this.notificationTypeModel
      .find(
        { status: 'active', deleted_at: null },
        { created_at: 0, updated_at: 0, deleted_at: 0, __v: 0 },
      )
      .sort({ name: 1 })
      .lean();

    // Tính toán số lượng chưa đọc cho mỗi loại
    const unreadCounts = await this.notificationModel.aggregate([
      {
        $match: {
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

    // Gắn thêm trường unread_count vào từng type
    return types.map((t) => ({
      ...t,
      unread_count: unreadMap.get(t._id.toString()) || 0,
    }));
  }
}
