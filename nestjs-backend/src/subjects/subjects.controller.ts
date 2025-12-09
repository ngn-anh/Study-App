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
import { SubjectsService } from './subjects.service';
import { ApiTags } from '@nestjs/swagger';
import { GetSubjectsByClassDto } from './dto/get-subjects-by-class.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get('by-class')
  async getSubjectsByClass(
    @Query() getSubjectsByClassDto: GetSubjectsByClassDto,
  ) {
    return await this.subjectsService.getSubjectsByClass(getSubjectsByClassDto);
  }

  @Get()
  async getAll(@Query() query: any) {
    return this.subjectsService.findAll(query);
  }

  // CREATE
  @Post()
  async create(@Body() dto: CreateSubjectDto) {
    return {
      message: 'Tạo môn học thành công',
      data: await this.subjectsService.create(dto),
    };
  }

  // GET DETAIL
  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return {
      message: 'Lấy chi tiết môn học thành công',
      data: await this.subjectsService.findOne(id),
    };
  }

  // UPDATE
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) {
    return {
      message: 'Cập nhật môn học thành công',
      data: await this.subjectsService.update(id, dto),
    };
  }

  //DELETE
  @Delete(':id')
  async deleteSubject(@Param('id') id: string) {
    return this.subjectsService.deleteSubject(id);
  }
}
