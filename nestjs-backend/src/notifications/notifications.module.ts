// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationType, NotificationTypeSchema } from 'src/notification-types/schemas/notification-type.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ReminderSchedule, ReminderScheduleSchema } from 'src/reminder-schedules/schemas/reminder-schedule.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationType.name, schema: NotificationTypeSchema },
      { name: ReminderSchedule.name, schema: ReminderScheduleSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
