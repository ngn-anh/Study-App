import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReminderSchedule, ReminderScheduleDocument } from './schemas/reminder-schedule.schema';
import { CreateReminderScheduleDto } from './dto/create-reminder-schedule.dto';
import { UpdateReminderScheduleDto } from './dto/update-reminder-schedule.dto';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class ReminderSchedulesService {
  constructor(
    @InjectModel(ReminderSchedule.name)
    private readonly reminderScheduleModel: Model<ReminderScheduleDocument>,
    @InjectQueue('reminderQueue') private readonly reminderQueue: Queue
  ) {}

  // --- Lấy tất cả lịch hẹn ---
  async findAllGlobal() {
    return this.reminderScheduleModel.find();
  }

  async findAll(user_id: string) {
    return this.reminderScheduleModel.find({
      user_id: new Types.ObjectId(user_id),
      $or: [
        { deleted_at: null },
        { deleted_at: { $exists: false } }
      ],
    }).sort({ due_date: 1, due_time: 1 });
  }

  async findOne(id: string) {
    const schedule = await this.reminderScheduleModel.findById(id);
    if (!schedule) throw new NotFoundException('Lịch hẹn không tồn tại');
    return schedule;
  }

  // --- Tạo mới ---
  async create(dto: CreateReminderScheduleDto) {
    const created = new this.reminderScheduleModel({
      ...dto,
      user_id: new Types.ObjectId(dto.user_id),
    });
    const saved = await created.save();

    // Schedule job ngay sau khi tạo
    await this.scheduleReminder(saved);

    return saved;
  }

  // --- Cập nhật ---
  private toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  async update(id: string, dto: UpdateReminderScheduleDto) {
    const updateData: any = { ...dto };

    if (dto.user_id) {
      updateData.user_id = this.toObjectId(dto.user_id);
    }

    const updated = await this.reminderScheduleModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updated) throw new NotFoundException('Lịch hẹn không tồn tại');

    // Cập nhật job reminder
    await this.updateReminderJob(updated);

    return updated.toObject();
  }

  // --- Xóa mềm ---
  async softDeleteMany(ids: string[]) {
    if (!ids || ids.length === 0) return { modifiedCount: 0 };

    const objectIds = ids.map(id => new Types.ObjectId(id));
    const result = await this.reminderScheduleModel.updateMany(
      { _id: { $in: objectIds } },
      { deleted_at: new Date() }
    );

    // Xóa job cron liên quan
    for (const id of ids) {
      await this.removeDailyCronJobById(id);
    }

    return result;
  }

  // --- Helper parse remind_date + remind_time ---
  private parseRemindDateTime(remind_date: string | Date, remind_time: string): Date {
    let dateObj: Date;

    if (remind_date instanceof Date) {
      dateObj = new Date(remind_date);
    } else {
      dateObj = new Date(remind_date);
    }

    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid remind_date, fallback to now');
      return new Date();
    }

    const [hours, minutes] = remind_time.split(':').map(Number);
    dateObj.setUTCHours(hours - 7, minutes, 0, 0); // UTC → VN
    return dateObj;
  }

  // --- Tạo job reminder ---
  async scheduleReminder(schedule) {
    await this.updateReminderJob(schedule);
  }

  // --- Update job reminder ---
  async updateReminderJob(schedule: any) {
    // Xóa job cũ nếu có
    await this.removeDailyCronJobById(schedule._id.toString());

    const [hours, minutes] = schedule.remind_time.split(':').map(Number);

    if (schedule.repeat_mode === 'daily') {
      // Tạo cron job hằng ngày
      await this.reminderQueue.add(
        'sendReminder',
        { schedule },
        {
          repeat: {
            cron: `${minutes} ${hours} * * *`,
            tz: 'Asia/Ho_Chi_Minh',
          },
          jobId: schedule._id.toString(), // đảm bảo duy nhất
        }
      );
      console.log('Scheduled daily cron reminder:', schedule.title);
      return;
    }

    // Nếu không lặp → job một lần
    const remindDateTime = this.parseRemindDateTime(
      schedule.remind_date,
      schedule.remind_time
    );
    const delay = remindDateTime.getTime() - Date.now();

    await this.reminderQueue.add(
      'sendReminder',
      { schedule },
      { delay: Math.max(0, delay) }
    );

    console.log('Scheduled one-time reminder:', schedule.title);
  }

  // --- Xóa cron job cũ ---
  async removeDailyCronJobById(scheduleId: string) {
    const repeatableJobs = await this.reminderQueue.getRepeatableJobs();
    const job = repeatableJobs.find(j => j.id === scheduleId);
    if (job) {
      await this.reminderQueue.removeRepeatableByKey(job.key);
      console.log('Removed old cron job for schedule:', scheduleId);
    }
  }
}
