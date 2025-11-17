// src/notification-types/notification-types.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationType, NotificationTypeSchema } from './schemas/notification-type.schema';
import { Notification, NotificationSchema } from 'src/notifications/schemas/notification.schema';
import { NotificationTypesService } from './notification-types.service';
import { NotificationTypesController } from './notification-types.controller';
import { ReminderSchedule, ReminderScheduleSchema } from 'src/reminder-schedules/schemas/reminder-schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationType.name, schema: NotificationTypeSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: ReminderSchedule.name, schema: ReminderScheduleSchema }
    ]),
  ],
  controllers: [NotificationTypesController],
  providers: [NotificationTypesService],
  exports: [NotificationTypesService],
})
export class NotificationTypesModule {}
