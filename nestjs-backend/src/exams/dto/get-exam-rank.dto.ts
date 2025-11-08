// dto/get-exam-rank.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetExamRankDto {
  @ApiPropertyOptional({ description: 'ID bài thi' })
  @IsString()
  examId: string;

  @ApiPropertyOptional({ description: 'ID user hiện tại (để đánh dấu bản ghi của mình)' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên người dùng' })
  @IsOptional()
  @IsString()
  searchName?: string;
}
