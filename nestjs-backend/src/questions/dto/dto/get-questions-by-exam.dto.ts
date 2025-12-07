import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetQuestionsByExamDto {
  @ApiProperty({ description: 'Exam ID cần lấy câu hỏi', example: '6908a903bc2ae0fd775ccad6' })
  @IsMongoId()
  exam_id: string;
}
