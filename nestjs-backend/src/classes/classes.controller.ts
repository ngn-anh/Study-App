import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { GetClassByCodeDto } from './dto/get-class-by-code.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

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

    @Post()
    create(@Body() dto: CreateClassDto) {
        return this.classesService.create(dto);
    }

    @Get()
    findAll() {
        return this.classesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.classesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
        return this.classesService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.classesService.remove(id);
    }
}
