// dto/update-question.dto.ts
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAnswerDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsBoolean()
  is_correct?: boolean;
}

export class UpdateQuestionDto {
  @IsString()
  description: string;

  @IsNumber()
  difficulty: number;

  @IsNumber()
  @IsOptional()
  section: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  @IsArray()
  answers?: UpdateAnswerDto[];
}
