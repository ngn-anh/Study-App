import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray, IsInt, Min } from 'class-validator';
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

  @ApiPropertyOptional({ enum: SortOrder, description: 'Sắp xếp theo thời gian' })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiPropertyOptional({ description: 'Mã lớp hiện tại của user (FE gửi)' })
  @IsOptional()
  @IsString()
  currentClassCode?: string;

  @ApiPropertyOptional({ type: [String], description: 'Danh sách mã môn học (FE gửi)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    // Nếu là string "MATH,LIT" → tách thành array
    if (typeof value === 'string') return value.split(',');
    // Nếu là array gửi từ axios → giữ nguyên
    return Array.isArray(value) ? value : [value];
  })
  subjectCodes?: string[];

  @ApiPropertyOptional({ description: 'Loại bài thi (1 hoặc 2)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  type?: number;

  @ApiPropertyOptional({ description: 'Trang hiện tại', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng bản ghi trên 1 trang', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
