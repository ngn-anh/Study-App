import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateReminderScheduleDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsDateString()
  due_date: string;

  @IsString()
  due_time: string;

  @IsDateString()
  remind_date: string;

  @IsString()
  remind_time: string;

  @IsString()
  @IsOptional()
  repeat_mode?: string;

  @IsString()
  @IsOptional()
  fcm_token?: string; 
}
