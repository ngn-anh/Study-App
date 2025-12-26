import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolePermissionsService } from './role-permissions.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { UpdateRolePermissionsPayloadDto } from './dto/update-role-permissions.dto';

@ApiTags('role-permissions')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  /** Gán permissions cho role */
  @Post()
  assign(@Body() dto: AssignPermissionsDto) {
    return this.rolePermissionsService.assign(dto);
  }

  /** Danh sách role-permissions */
  @Get()
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  /** Lấy permissions theo role */
  @Get(':role_code')
  findByRole(@Param('role_code') role_code: string) {
    return this.rolePermissionsService.findByRole(role_code);
  }

  /** Update permissions cho role */
  @Put(':role_code')
  update(
    @Param('role_code') role_code: string,
    @Body() dto: UpdateRolePermissionsPayloadDto,
  ) {
    return this.rolePermissionsService.update(role_code, dto);
  }

  /** Xoá 1 permission khỏi role */
  @Delete(':role_code/:permission_code')
  removePermission(
    @Param('role_code') role_code: string,
    @Param('permission_code') permission_code: string,
  ) {
    return this.rolePermissionsService.removePermission(
      role_code,
      permission_code,
    );
  }

  /** Xoá toàn bộ permissions của role */
  @Delete(':role_code')
  removeRole(@Param('role_code') role_code: string) {
    return this.rolePermissionsService.removeRole(role_code);
  }
}
