import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { NotificationSettingService } from './notification-setting.service';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';

@Controller('notification-setting')
export class NotificationSettingController {
  constructor(private notificationSettingService: NotificationSettingService) {}

  @Get(':user_id')
  getByUser(@Param('user_id') user_id: string) {
    return this.notificationSettingService.getByUser(user_id);
  }

  /**
   * PUT /notification-setting/:user_id
   * - Nếu payload có temporary_muted_until → tạm mute
   * - Nếu chỉ có is_open_noti → bật/tắt ngay
   */
  @Put(':user_id')
  async updateByUser(
    @Param('user_id') user_id: string,
    @Body() dto: UpdateNotificationSettingDto
  ) {
    const { is_open_noti, temporary_muted_until, temporary_muted_type } = dto;

    // Nếu có temporary_muted_until → tạm mute
    if (temporary_muted_until) {
      const untilTime = new Date(temporary_muted_until).getTime();
      const durationMs = untilTime - Date.now();
      if (durationMs > 0) {
        return this.notificationSettingService.muteTemporarily(
          user_id,
          durationMs,
          temporary_muted_type || 'temporary'
        );
      }
    }

    // Nếu không tạm mute → bật/tắt ngay
    if (typeof is_open_noti === 'boolean') {
      return this.notificationSettingService.toggleNotification(
        user_id,
        is_open_noti
      );
    }

    return this.notificationSettingService.getByUser(user_id);
  }
}
