import { Controller, Post,Get, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Get()
    async findAll(): Promise<any[]> {
    return this.service.findAll();
    }
}
