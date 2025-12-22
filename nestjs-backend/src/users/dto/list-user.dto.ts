import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Danh sách role',
    isArray: true,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(String);
    if (value !== undefined) return [String(value)];
    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  roles?: String[];

   @ApiPropertyOptional({
    description: 'Danh sách role loại trừ',
    isArray: true,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(String);
    if (value !== undefined) return [String(value)];
    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  exclude_roles?: String[];

  @ApiPropertyOptional()
  @IsOptional()
  status?: number;

  @ApiPropertyOptional()
  @IsOptional()
  class?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
