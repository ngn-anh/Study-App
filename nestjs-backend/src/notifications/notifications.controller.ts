// src/notifications/notifications.controller.ts
import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications?code=SALE
  @Get()
  async getByCode(
    @Query('code') code: string,
    @Query('user_id') user_id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const data = await this.notificationsService.getNotificationsByCode(code, user_id,page,limit);
    return { success: true, data };
  }

  // API đánh dấu tất cả notification theo type là đã đọc
  @Patch('mark-all-read')
  async markAllRead(
    @Query('type') type: string,
    @Query('user_id') user_id: string
  ) {
    return this.notificationsService.markAllReadByType(type, user_id);
  }

   // PATCH /notifications/:id/mark-read
  @Patch(':id/mark-read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  async getUnreadCount(@Query('user_id') user_id: string) {
    const unread_count = await this.notificationsService.getUnreadCount(user_id);
    return { success: true, data: { unread_count } };
  }
}
