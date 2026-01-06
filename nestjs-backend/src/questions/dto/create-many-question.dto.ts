import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateManyAnswerDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  is_correct?: boolean;
}

class CreateManyQuestionItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  difficulty: number;

  @IsNumber()
  @IsOptional()
  section: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateManyAnswerDto)
  answers: CreateManyAnswerDto[];
}

export class CreateManyQuestionDto {
  @IsMongoId()
  exam_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateManyQuestionItemDto)
  questions: CreateManyQuestionItemDto[];
}
