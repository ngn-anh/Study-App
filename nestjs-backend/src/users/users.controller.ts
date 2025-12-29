import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ListUserDto } from './dto/list-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Post('update-avatar')
  async updateAvatar(@Body() dto: UpdateAvatarDto) {
    return this.usersService.updateAvatar(dto);
  }

  @Put('update-profile')
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(dto);
  }

  @Get()
  async list(@Query() query: ListUserDto) {
    return this.usersService.list(query);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Get(':id')
  async getUserDetail(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
