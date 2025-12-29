import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetSubjectsByClassDto } from './dto/get-subjects-by-class.dto';
import { Subject, SubjectDocument } from './schemas/subjects.schema';
import { Class, ClassDocument } from 'src/classes/schemas/classes.schema';
import {
  SubjectClass,
  SubjectClassDocument,
} from 'src/subjects-classes/schemas/subjects-classes.schema';
import { removeAccentsRegex } from 'src/helper';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name)
    private subjectModel: Model<SubjectDocument>,

    @InjectModel(Class.name)
    private classModel: Model<ClassDocument>,
    @InjectModel(SubjectClass.name)
    private subjectClassModel: Model<SubjectClassDocument>,
  ) {}

  private readonly ERROR_CODES = {
    SUCCESS: 0,
    MISSING_PARAM: 1,
    INVALID_CLASS_ID: 2,
    CLASS_NOT_FOUND: 3,
    NO_SUBJECTS_FOUND: 4,
    INTERNAL_ERROR: 99,
  };

  private readonly ERROR_MESSAGES = {
    SUCCESS: 'Thành công',
    MISSING_PARAM: 'Thiếu tham số class_id',
    INVALID_CLASS_ID: 'class_id không hợp lệ',
    CLASS_NOT_FOUND: 'Không tìm thấy lớp học',
    NO_SUBJECTS_FOUND: 'Không tìm thấy môn học nào',
    INTERNAL_ERROR: 'Lỗi hệ thống',
  };

  async getSubjectsByClass(getSubjectsByClassDto: GetSubjectsByClassDto) {
    try {
      const { class_id } = getSubjectsByClassDto;
      console.log('loanhtm class_id: ', class_id);
      // Kiểm tra tham số
      if (!class_id) {
        return {
          errorCode: this.ERROR_CODES.MISSING_PARAM,
          data: null,
          message: this.ERROR_MESSAGES.MISSING_PARAM,
        };
      }

      // Kiểm tra class_id có hợp lệ không
      if (!Types.ObjectId.isValid(class_id)) {
        return {
          errorCode: this.ERROR_CODES.INVALID_CLASS_ID,
          data: null,
          message: this.ERROR_MESSAGES.INVALID_CLASS_ID,
        };
      }

      // Lấy danh sách subject-class mapping
      const subjectClassMappings = await this.subjectClassModel
        .find({ class_id: new Types.ObjectId(class_id) })
        .exec();

      if (subjectClassMappings.length === 0) {
        return {
          errorCode: this.ERROR_CODES.NO_SUBJECTS_FOUND,
          data: [],
          message: this.ERROR_MESSAGES.NO_SUBJECTS_FOUND,
        };
      }

      // Lấy danh sách subject_id từ mapping
      const subjectIds = subjectClassMappings.map((sc) => sc.subject_id);

      // Lấy danh sách môn học (chỉ lấy những môn không bị xóa)
      const subjects = await this.subjectModel
        .find({
          _id: { $in: subjectIds },
          deleted_at: null,
        })
        .select('-__v')
        .exec();

      if (subjects.length === 0) {
        return {
          errorCode: this.ERROR_CODES.NO_SUBJECTS_FOUND,
          data: [],
          message: this.ERROR_MESSAGES.NO_SUBJECTS_FOUND,
        };
      }

      // Format response data
      const formattedSubjects = subjects.map((subject) => ({
        _id: subject._id,
        name: subject.name,
        code: subject.code,
        description: subject.description,
        image: subject.image,
      }));

      return {
        errorCode: this.ERROR_CODES.SUCCESS,
        data: formattedSubjects,
        total: formattedSubjects.length,
        message: this.ERROR_MESSAGES.SUCCESS,
      };
    } catch (error) {
      console.error('Error in getSubjectsByClass:', error);
      return {
        errorCode: this.ERROR_CODES.INTERNAL_ERROR,
        data: null,
        message: this.ERROR_MESSAGES.INTERNAL_ERROR,
      };
    }
  }

  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { deleted_at: null };

    // Search không dấu
    if (query.name) {
      const regex = removeAccentsRegex(query.name);
      filter.name = { $regex: regex, $options: 'i' };
    }

    if (query.status) filter.status = Number(query.status);

    const [data, total] = await Promise.all([
      this.subjectModel
        .find(filter)
        .select('-created_at -updated_at')
        .skip(skip)
        .limit(limit)
        .exec(),

      // total = tổng sau khi filter nhưng trước khi phân trang
      this.subjectModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        pagination: {
          total,
          page,
          pageSize: limit,
        },
      },
    };
  }

  // CREATE
  async create(createDto: CreateSubjectDto) {
    const created = new this.subjectModel(createDto);
    return created.save();
  }

  // GET DETAIL
  async findOne(id: string) {
    const subject = await this.subjectModel
      .findOne({ _id: id, deleted_at: null })
      .select('-created_at -updated_at');

    // Đếm số lớp liên quan
    const totalClass = await this.subjectClassModel.countDocuments({
      subject_id: new Types.ObjectId(id),
    });

    if (!subject) throw new NotFoundException('Không tìm thấy môn học');
    return {
      ...subject.toObject(),
      total_class: totalClass,
    };
  }

  // UPDATE
  async update(id: string, updateDto: UpdateSubjectDto) {
    const updated = await this.subjectModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateDto, { new: true })
      .select('-created_at -updated_at');

    if (!updated) throw new NotFoundException('Không tìm thấy môn học');
    return updated;
  }

  //DELETE
  async deleteSubject(id: string) {
    const objectId = new Types.ObjectId(id);

    const subject = await this.subjectModel.findById(objectId);
    if (!subject) {
      return {
        success: false,
        message: 'Môn học không tồn tại',
      };
    }

    // Xóa liên kết môn - lớp
    await this.subjectClassModel.deleteMany({
      subject_id: objectId,
    });

    // Soft delete
    await this.subjectModel.findByIdAndUpdate(objectId, {
      deleted_at: new Date(),
    });

    return {
      success: true,
      message: 'Xóa môn học thành công',
    };
  }
}
