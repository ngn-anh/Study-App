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
import { GetBySubjectClassDto } from './dto/get-by-subjectId-classId.dto';
import { SubjectsClassesService } from './subjects-classes.service';

@ApiTags('SubjectsClasses')
@Controller('subjectsClasses')
export class SubjectsClassesController {
    constructor(private readonly subjectsClassesService: SubjectsClassesService) { }

    @Get('subject-class')
    async getBySubjectClass(
        @Query() getBySubjectClassDto: GetBySubjectClassDto,
    ) {
        return await this.subjectsClassesService.getBySubjectClass(getBySubjectClassDto);
    }
}
