// import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
// import { ClassesService } from './class.service';
// import { CreateClassDto } from './dto/create-class.dto';
// import { UpdateClassDto } from './dto/update-class.dto';

// // @Controller('classes')
// // export class ClassesController {
// //   constructor(private readonly classesService: ClassesService) {}

// //   @Post()
// //   create(@Body() dto: CreateClassDto) {
// //     return this.classesService.create(dto);
// //   }

//   @Get()
//   findAll(@Query() query: any) {
//     return this.classesService.findAll(query);
//   }

//   @Get('program')
//   async getList(@Query() query) {
//     return this.classesService.getListClassWithSubjects(query);
//   }

//   @Get('program/:id')
//   async getDetailProgram(@Param('id') id: string) {
//     return this.classesService.getDetailProgram(id);
//   }

//   @Post('program')
//   async createProgram(@Body() body: { class_id: string; subject_ids: string[] }) {
//     return this.classesService.createProgram(body.class_id, body.subject_ids);
//   }

// //   @Get(':id')
// //   findOne(@Param('id') id: string) {
// //     return this.classesService.findOne(id);
// //   }

// //   @Patch(':id')
// //   update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
// //     return this.classesService.update(id, dto);
// //   }

//   @Delete(':id')
//   delete(@Param('id') id: string) {
//     return this.classesService.remove(id);
//   }

// }
