import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class GetQuestionsByExamDto {
  @ApiProperty({
    description: 'Exam ID cần lấy câu hỏi',
    example: '6908a903bc2ae0fd775ccad6'
  })
  @IsMongoId()
  exam_id: string;

  @ApiPropertyOptional({
    description: 'Đảo ngẫu nhiên thứ tự câu hỏi',
    example: 'true',
    default: 'false'
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  reverseQuestion?: boolean;

  @ApiPropertyOptional({
    description: 'Đảo ngẫu nhiên thứ tự câu trả lời',
    example: 'false',
    default: 'false'
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  reverseAnswer?: boolean;
}
