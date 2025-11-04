import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { ExamsFilterDto } from './dto/exams-filter.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  async getExams(@Query() filterDto: ExamsFilterDto) {
    console.log('filterDto',filterDto)
    return this.examsService.getExams(filterDto);
  }
}
