import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    example: ['user.read', 'user.delete'],
    isArray: true,
  })
  @IsArray()
  permissions: string[];
}
