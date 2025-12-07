import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderSchedulesService } from './reminder-schedules.service';
import { ReminderSchedulesController } from './reminder-schedules.controller';
import { ReminderSchedule, ReminderScheduleSchema } from './schemas/reminder-schedule.schema';
import { BullModule } from '@nestjs/bull';
import { ReminderProcessor } from './reminder-schedule.processor';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationTypesModule } from 'src/notification-types/notification-types.module';
import { NotificationSettingModule } from 'src/notification-setting/notification-setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReminderSchedule.name, schema: ReminderScheduleSchema }]),
    BullModule.registerQueue({
      name: 'reminderQueue',  // tên queue
    }),
    NotificationsModule,
    NotificationTypesModule,
    NotificationSettingModule,
  ],
  controllers: [ReminderSchedulesController],
  providers: [ReminderSchedulesService, ReminderProcessor],
})
export class ReminderSchedulesModule {}
