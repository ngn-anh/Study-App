import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  role_code: string;

  @ApiProperty({
    example: ['user.create', 'user.update'],
    isArray: true,
  })
  @IsArray()
  permissions: string[];
}
