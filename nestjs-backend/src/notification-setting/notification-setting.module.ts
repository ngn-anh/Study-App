// src/notification-setting/notification-setting.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationSetting,
  NotificationSettingSchema,
} from './schemas/notification-setting.schema';
import { NotificationSettingService } from './notification-setting.service';
import { NotificationSettingController } from './notification-setting.controller';
import { BullModule } from '@nestjs/bull';
import { NotificationSettingProcessor } from './notification-setting.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationSetting.name,
        schema: NotificationSettingSchema,
      },
    ]),
     BullModule.registerQueue({
      name: 'notification',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [NotificationSettingController],
  providers: [NotificationSettingService,NotificationSettingProcessor],
  exports: [NotificationSettingService],
})
export class NotificationSettingModule {}
