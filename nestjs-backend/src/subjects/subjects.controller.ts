import { Controller, Get, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ApiTags } from '@nestjs/swagger';
import { GetSubjectsByClassDto } from './dto/get-subjects-by-class.dto';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Get('by-class')
    async getSubjectsByClass(@Query() getSubjectsByClassDto: GetSubjectsByClassDto) {
        return await this.subjectsService.getSubjectsByClass(getSubjectsByClassDto);
    }

}