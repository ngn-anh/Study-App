// notification-setting.processor.ts
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { NotificationSettingService } from './notification-setting.service';

@Processor('notification')
export class NotificationSettingProcessor {
  constructor(private readonly notificationService: NotificationSettingService) {}

  @Process('restore')
  async handleRestoreJob(job: Job<{ user_id: string }>) {
    const { user_id } = job.data;
    console.log(`Restoring notifications for user ${user_id}`);
    await this.notificationService.updateByUser(user_id, {
      is_open_noti: true,
      temporary_muted_until: null,
      temporary_muted_type: null,
    });
  }
}
