import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum ExamStatus {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}

export enum SortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class ExamsFilterDto {
  @ApiPropertyOptional({ enum: ExamStatus, description: 'Trạng thái bài thi' })
  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên bài thi' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sắp xếp theo thời gian',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiPropertyOptional({ description: 'Mã lớp hiện tại của user' })
  @IsOptional()
  @IsString()
  class_id?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Danh sách mã môn học',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === 'string') return value.split(',');
    return Array.isArray(value) ? value : [value];
  })
  subjectCodes?: string[];

  @ApiPropertyOptional({ description: 'Loại bài thi (1 hoặc 2)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  type?: number;

  @ApiPropertyOptional({ description: 'Độ khó (1: Dễ, 2: Trung bình, 3: Khó)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  difficulty?: number;

  @ApiPropertyOptional({ description: 'Trang hiện tại', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên 1 trang',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'ID của user để check đã làm bài chưa' })
  @IsOptional()
  @IsString()
  user_id?: string;
}
