import { Body, Controller, Post, Get, Query, Param, Put, Delete } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRolePermissionsDto } from "./dto/update-role-permissions.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

   /** CREATE */
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Get('options')
  getRoleOptions() {
    return this.service.getRoleOptions();
  }

  /** DETAIL */
  @Get(':code')
  getDetail(@Param('code') code: string) {
    return this.service.getDetail(code);
  }

  /** UPDATE */
  @Put(':code')
  update(
    @Param('code') code: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.update(code, dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':code/permissions')
  async getPermissions(@Param('code') code: string) {
    return this.service.getRolePermissions(code);
  }

  @Put(':roleCode/permissions')
  updateRolePermissions(
    @Param('roleCode') roleCode: string,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.service.updateRolePermissions(
      roleCode,
      dto.permissionCodes,
    );
  }

  @Delete(':code')
  delete(@Param('code') code: string) {
    return this.service.delete(code);
  }

}
