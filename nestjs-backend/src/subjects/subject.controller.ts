// // subject.controller.ts
// import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
// import { SubjectService } from './subject.service';
// import { CreateSubjectDto } from './dto/create-subject.dto';
// import { UpdateSubjectDto } from './dto/update-subject.dto';

// @Controller('subject')
// export class SubjectController {
//   constructor(private readonly subjectService: SubjectService) {}

//   @Get()
//     async getAll(@Query() query: any) {
//         return this.subjectService.findAll(query);
//     }

//    // CREATE
//   @Post()
//   async create(@Body() dto: CreateSubjectDto) {
//     return {
//       message: 'Tạo môn học thành công',
//       data: await this.subjectService.create(dto),
//     };
//   }

//   // GET DETAIL
//   @Get(':id')
//   async getDetail(@Param('id') id: string) {
//     return {
//       message: 'Lấy chi tiết môn học thành công',
//       data: await this.subjectService.findOne(id),
//     };
//   }

//   // UPDATE
//   @Put(':id')
//   async update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) {
//     return {
//       message: 'Cập nhật môn học thành công',
//       data: await this.subjectService.update(id, dto),
//     };
//   }

//   //DELETE
//   @Delete(':id')
//   async deleteSubject(@Param('id') id: string) {
//     return this.subjectService.deleteSubject(id);
//   }
// }
