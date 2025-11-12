import { Controller, Get } from '@nestjs/common';
import { NotificationTypesService } from './notification-types.service';

@Controller('notification-types')
export class NotificationTypesController {
  constructor(private readonly notificationTypesService: NotificationTypesService) {}

  @Get()
  async getAll() {
    const data = await this.notificationTypesService.findAll();
    return {
      message: 'Lấy danh sách loại thông báo thành công',
      data,
    };
  }
}
