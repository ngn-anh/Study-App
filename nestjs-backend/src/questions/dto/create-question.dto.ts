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
    exam_id: string;                     // ObjectId của Exam

    @IsString()
    @IsNotEmpty()
    description: string;                // JSON string được MathInput trả về

    @IsNumber()
    @IsNotEmpty()
    difficulty: number;                 // 1‑4

    @IsString()
    @IsNotEmpty()
    section: string;                    // ví dụ: "1", "2", …

    // ------------ optional answers -----------------
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAnswerDto)
    answers?: CreateAnswerDto[];
}