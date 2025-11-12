// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationType, NotificationTypeSchema } from 'src/notification-types/schemas/notification-type.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationType.name, schema: NotificationTypeSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
