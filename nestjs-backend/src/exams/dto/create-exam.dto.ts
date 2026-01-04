import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  type: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  difficulty?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  duration: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: true })
  @IsString()
  subjectClassId: string;
}
