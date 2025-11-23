import { Controller, Get, Query } from '@nestjs/common';
import { NotificationTypesService } from './notification-types.service';

@Controller('notification-types')
export class NotificationTypesController {
  constructor(private readonly notificationTypesService: NotificationTypesService) {}

  @Get()
  async getAll(@Query('user_id') user_id: string) {
    const data = await this.notificationTypesService.findAll(user_id);
    return {
      message: 'Lấy danh sách loại thông báo thành công',
      data,
    };
  }
}
