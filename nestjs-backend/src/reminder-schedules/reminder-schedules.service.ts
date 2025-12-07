import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReminderSchedule, ReminderScheduleDocument } from './schemas/reminder-schedule.schema';
import { CreateReminderScheduleDto } from './dto/create-reminder-schedule.dto';
import { UpdateReminderScheduleDto } from './dto/update-reminder-schedule.dto';

@Injectable()
export class ReminderSchedulesService {
  constructor(
    @InjectModel(ReminderSchedule.name)
    private readonly reminderScheduleModel: Model<ReminderScheduleDocument>,
  ) {}


  

  // Lấy tất cả lịch hẹn (bất kể user)
    async findAllGlobal() {
    return this.reminderScheduleModel.find(); 
    }


  // Tạo mới
  async create(dto: CreateReminderScheduleDto) {
    const created = new this.reminderScheduleModel({
      ...dto,
      user_id: new Types.ObjectId(dto.user_id),
    });
    return created.save();
  }

  // Lấy tất cả lịch chưa xoá của user
  async findAll(user_id: string) {
  return this.reminderScheduleModel.find({
    user_id: new Types.ObjectId(user_id),
    $or: [
      { deleted_at: null },          // bản ghi chưa xoá
      { deleted_at: { $exists: false } } // bản ghi chưa có field deleted_at
    ],
  }).sort({ due_date: 1, due_time: 1 }); // có thể sort theo ngày giờ
}

  // Lấy chi tiết 1 lịch
  async findOne(id: string) {
    const schedule = await this.reminderScheduleModel.findById(id);
    if (!schedule) throw new NotFoundException('Lịch hẹn không tồn tại');
    return schedule;
  }

  // Cập nhật
  // Method tiện ích
  private toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  async update(id: string, dto: UpdateReminderScheduleDto) {
    const updateData: any = { ...dto };

    if (dto.user_id) {
      updateData.user_id = this.toObjectId(dto.user_id); // dùng method
    }

    const updated = await this.reminderScheduleModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updated) throw new NotFoundException('Lịch hẹn không tồn tại');

    const result = updated.toObject();
    return result;
  }


  // Xóa mềm nhiều lịch hẹn
  async softDeleteMany(ids: string[]) {
    if (!ids || ids.length === 0) return { modifiedCount: 0 };

    const objectIds = ids.map(id => new Types.ObjectId(id));
    const result = await this.reminderScheduleModel.updateMany(
      { _id: { $in: objectIds } },
      { deleted_at: new Date() }
    );

    return result; // result.modifiedCount => số bản ghi đã xóa
  }
}
