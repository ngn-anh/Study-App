// src/notification-setting/dto/update-notification-setting.dto.ts

import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationSettingDto {
  @IsOptional()
  @IsBoolean()
  is_open_noti?: boolean;

  @IsOptional()
  @IsDateString()
  temporary_muted_until?: string | null;

  @IsOptional()
  @IsString()
  temporary_muted_type?: string | null;
}
