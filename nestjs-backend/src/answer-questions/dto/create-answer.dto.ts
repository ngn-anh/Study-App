// src/answer-questions/dto/create-answer.dto.ts
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
} from 'class-validator';

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty()
    description: string;               // JSON string (MathInput) hoặc plain text

    @IsOptional()
    @IsString()
    image?: string;                    // URL ảnh (nếu có)

    @IsOptional()
    @IsBoolean()
    is_correct?: boolean = false;

    @IsOptional()
    @IsString()
    explanation?: string;
}