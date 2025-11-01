import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderSchedulesService } from './reminder-schedules.service';
import { ReminderSchedulesController } from './reminder-schedules.controller';
import { ReminderSchedule, ReminderScheduleSchema } from './schemas/reminder-schedule.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ReminderSchedule.name, schema: ReminderScheduleSchema }])],
  controllers: [ReminderSchedulesController],
  providers: [ReminderSchedulesService],
})
export class ReminderSchedulesModule {}
