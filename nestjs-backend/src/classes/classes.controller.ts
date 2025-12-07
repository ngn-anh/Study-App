import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { GetClassByCodeDto } from './dto/get-class-by-code.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Get('by-code')
    async getClassByCode(@Query() getClassByCodeDto: GetClassByCodeDto) {
        return await this.classesService.getClassByCode(getClassByCodeDto);
    }

    @Get(':id')
    async getClassById(@Param('id') id: string) {
        return this.classesService.getClassById(id);
    }
}