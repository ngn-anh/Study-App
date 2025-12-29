// // subject.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Subject, SubjectDocument } from './schema/subjects.schema';
// import { removeAccentsRegex } from 'src/helper';
// import { CreateSubjectDto } from './dto/create-subject.dto';
// import { UpdateSubjectDto } from './dto/update-subject.dto';
// import {
//   SubjectClass,
//   SubjectClassDocument,
// } from 'src/subjects-classes/schemas/subjects-classes.schema';

// @Injectable()
// export class SubjectService {
//   constructor(
//     @InjectModel(Subject.name)
//     private subjectModel: Model<SubjectDocument>,

//     @InjectModel(SubjectClass.name)
//     private subjectClassModel: Model<SubjectClassDocument>,
//   ) {}

//   async findAll(query: any) {
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const filter: any = { deleted_at: null };

//     // Search không dấu
//     if (query.name) {
//       const regex = removeAccentsRegex(query.name);
//       filter.name = { $regex: regex, $options: 'i' };
//     }

//     if (query.status) filter.status = Number(query.status);

//     const [data, total] = await Promise.all([
//       this.subjectModel
//         .find(filter)
//         .select('-created_at -updated_at')
//         .skip(skip)
//         .limit(limit)
//         .exec(),

//       // total = tổng sau khi filter nhưng trước khi phân trang
//       this.subjectModel.countDocuments(filter),
//     ]);

//     return {
//       data,
//       meta: {
//         pagination: {
//           total,
//           page,
//           pageSize: limit,
//         },
//       },
//     };
//   }

//   // CREATE
//   async create(createDto: CreateSubjectDto) {
//     const created = new this.subjectModel(createDto);
//     return created.save();
//   }

//   // GET DETAIL
//   async findOne(id: string) {
//     const subject = await this.subjectModel
//       .findOne({ _id: id, deleted_at: null })
//       .select('-created_at -updated_at');

//     // Đếm số lớp liên quan
//     const totalClass = await this.subjectClassModel.countDocuments({
//       subject_id: new Types.ObjectId(id),
//     });

//     if (!subject) throw new NotFoundException('Không tìm thấy môn học');
//     return {
//       ...subject.toObject(),
//       total_class: totalClass,
//     };
//   }

//   // UPDATE
//   async update(id: string, updateDto: UpdateSubjectDto) {
//     const updated = await this.subjectModel
//       .findOneAndUpdate({ _id: id, deleted_at: null }, updateDto, { new: true })
//       .select('-created_at -updated_at');

//     if (!updated) throw new NotFoundException('Không tìm thấy môn học');
//     return updated;
//   }

//   //DELETE
//   async deleteSubject(id: string) {
//     const objectId = new Types.ObjectId(id);

//     const subject = await this.subjectModel.findById(objectId);
//     if (!subject) {
//       return {
//         success: false,
//         message: 'Môn học không tồn tại',
//       };
//     }

//     // Xóa liên kết môn - lớp
//     await this.subjectClassModel.deleteMany({
//       subject_id: objectId,
//     });

//     // Soft delete
//     await this.subjectModel.findByIdAndUpdate(objectId, {
//       deleted_at: new Date(),
//     });

//     return {
//       success: true,
//       message: 'Xóa môn học thành công',
//     };
//   }
// }
