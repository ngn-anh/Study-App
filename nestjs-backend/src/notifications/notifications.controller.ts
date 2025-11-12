// src/notifications/notifications.controller.ts
import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications?code=SALE
  @Get()
  async getByCode(@Query('code') code: string) {
    const data = await this.notificationsService.getNotificationsByCode(code);
    return { success: true, data };
  }

  // API đánh dấu tất cả notification theo type là đã đọc
  @Patch('mark-all-read')
  async markAllRead(@Query('type') type: string) {
    return this.notificationsService.markAllReadByType(type);
  }

   // PATCH /notifications/:id/mark-read
  @Patch(':id/mark-read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
