// src/questions/dto/create-question.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnswerDto } from '../../answer-questions/dto/create-answer.dto';

export class CreateQuestionDto {
  @IsMongoId()
  @IsNotEmpty()
  exam_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  difficulty: number;

  @IsNumber()
  @IsOptional()
  section: number;

  @IsString()
  @IsOptional()
  image: string;

  // ------------ optional answers -----------------
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers?: CreateAnswerDto[];
}
