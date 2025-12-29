import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

// Differentiate from roles module DTO to avoid Swagger schema collisions
export class UpdateRolePermissionsPayloadDto {
  @ApiProperty({
    example: ['user.read', 'user.delete'],
    isArray: true,
  })
  @IsArray()
  permissions: string[];
}
