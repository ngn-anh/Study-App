import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReminderSchedulesService } from './reminder-schedules.service';
import { CreateReminderScheduleDto } from './dto/create-reminder-schedule.dto';
import { UpdateReminderScheduleDto } from './dto/update-reminder-schedule.dto';
import { ApiTags, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReminderSchedule } from './schemas/reminder-schedule.schema';

@ApiTags('reminder-schedules')
@Controller('reminder-schedules')
export class ReminderSchedulesController {
  constructor(private readonly service: ReminderSchedulesService) {}

   // 🔹 Tạo schedule + schedule job
  @Post()
  @ApiBody({ type: CreateReminderScheduleDto })
  @ApiResponse({ status: 201, description: 'Tạo lịch hẹn mới và schedule job', type: ReminderSchedule })
  async create(@Body() dto: CreateReminderScheduleDto) {
    // Lưu schedule vào MongoDB
    const schedule = await this.service.create(dto);

    return { success: true, schedule };
  }

  @Get('user/:user_id')
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({ status: 200, description: 'Danh sách lịch hẹn của user', type: [ReminderSchedule] })
  findAll(@Param('user_id') user_id: string) {
    return this.service.findAll(user_id);
  }

  @Get('detail/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Chi tiết 1 lịch hẹn', type: ReminderSchedule })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateReminderScheduleDto })
  @ApiResponse({ status: 200, description: 'Cập nhật lịch hẹn', type: ReminderSchedule })
  update(@Param('id') id: string, @Body() dto: UpdateReminderScheduleDto) {
    return this.service.update(id, dto);
  }

  // Xóa mềm nhiều lịch hẹn
  @Post('delete-many')
  @ApiBody({ schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' } } } } })
  @ApiResponse({ status: 200, description: 'Xóa mềm nhiều lịch hẹn' })
  async softDeleteMany(@Body('ids') ids: string[]) {
    return this.service.softDeleteMany(ids);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Danh sách tất cả lịch hẹn', type: [ReminderSchedule] })
  async findAllGlobal() {
    return this.service.findAllGlobal();
  }
}
