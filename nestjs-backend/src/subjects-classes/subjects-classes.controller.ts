import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetBySubjectClassDto } from './dto/get-by-subjectId-classId.dto';
import { SubjectsClassesService } from './subjects-classes.service';

@ApiTags('SubjectsClasses')
@Controller('subject-class')
export class SubjectsClassesController {
  constructor(
    private readonly subjectsClassesService: SubjectsClassesService,
  ) {}

  @Get('info')
  async getBySubjectClass(@Query() getBySubjectClassDto: GetBySubjectClassDto) {
    return await this.subjectsClassesService.getBySubjectClass(
      getBySubjectClassDto,
    );
  }
}
