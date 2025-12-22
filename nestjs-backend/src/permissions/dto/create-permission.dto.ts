import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'user.create' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Tạo người dùng' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  module: string;

  @ApiProperty({ example: 'create' })
  @IsString()
  action: string;
}
