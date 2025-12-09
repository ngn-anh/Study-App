// import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
// import { ClassesService } from './class.service';
// import { CreateClassDto } from './dto/create-class.dto';
// import { UpdateClassDto } from './dto/update-class.dto';

// @Controller('classes')
// export class ClassesController {
//   constructor(private readonly classesService: ClassesService) {}

//   @Post()
//   create(@Body() dto: CreateClassDto) {
//     return this.classesService.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.classesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.classesService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
//     return this.classesService.update(id, dto);
//   }

//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.classesService.remove(id);
//   }
// }
