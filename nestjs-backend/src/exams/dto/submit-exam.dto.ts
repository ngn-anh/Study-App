import { IsArray, IsBoolean, IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsOptional()
  @IsMongoId({ message: 'answer_question_id phải là ObjectId hoặc null' })
  answer_question_id?: string | null;

  @IsBoolean()
  is_correct: boolean;
}

export class SubmitExamDto {
  @IsMongoId()
  exam_id: string;

  @IsMongoId()
  user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsOptional()
  time_start?: Date;

  @IsOptional()
  time_end?: Date;
}
