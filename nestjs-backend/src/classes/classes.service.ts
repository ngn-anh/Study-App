import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from './schemas/classes.schema';
import { GetClassByCodeDto } from './dto/get-class-by-code.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {
  SubjectClass,
  SubjectClassDocument,
} from 'src/subjects-classes/schemas/subjects-classes.schema';
import { Subject, SubjectDocument } from 'src/subjects/schemas/subjects.schema';
import { removeAccentsRegex } from 'src/helper';
import { GetClassesBySubjectDto } from './dto/get-classes-by-subject.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name)
    private classModel: Model<ClassDocument>,

    @InjectModel(SubjectClass.name)
    private subjectClassModel: Model<SubjectClassDocument>,

    @InjectModel(Subject.name)
    private subjectModel: Model<SubjectDocument>,
  ) {}

  private readonly ERROR_CODES_getClassByCode = {
    SUCCESS: 0,
    MISSING_PARAM: 1,
    CLASS_NOT_FOUND: 2,
    INTERNAL_ERROR: 99,
  };

  private readonly ERROR_MESSAGES_getClassByCode = {
    SUCCESS: 'Thành công',
    MISSING_PARAM: 'Thiếu tham số code',
    CLASS_NOT_FOUND: 'Không tìm thấy lớp học',
    INTERNAL_ERROR: 'Lỗi hệ thống',
  };

  private readonly ERROR_CODES_getClassById = {
    SUCCESS: 0,
    MISSING_PARAM: 1,
    ID_NOT_FOUND: 2,
    INVALID_ID: 3,
    INTERNAL_ERROR: 99,
  };

  private readonly ERROR_MESSAGES_getClassById = {
    SUCCESS: 'Thành công',
    MISSING_PARAM: 'Thiếu tham số classId',
    ID_NOT_FOUND: 'Không tìm thấy lớp học',
    INVALID_ID: 'ID không hợp lệ',
    INTERNAL_ERROR: 'Lỗi hệ thống',
  };

  private readonly ERROR_CODES_getClassesBySubject = {
    SUCCESS: 0,
    MISSING_PARAM: 1,
    INVALID_SUBJECT_ID: 2,
    SUBJECT_NOT_FOUND: 3,
    NO_CLASSES_FOUND: 4,
    INTERNAL_ERROR: 99,
  };

  private readonly ERROR_MESSAGES_getClassesBySubject = {
    SUCCESS: 'Thành công',
    MISSING_PARAM: 'Thiếu tham số subject_id',
    INVALID_SUBJECT_ID: 'subject_id không hợp lệ',
    SUBJECT_NOT_FOUND: 'Không tìm thấy môn học',
    NO_CLASSES_FOUND: 'Không tìm thấy lớp học nào',
    INTERNAL_ERROR: 'Lỗi hệ thống',
  };

  async getClassByCode(getClassByCodeDto: GetClassByCodeDto) {
    try {
      const { code } = getClassByCodeDto;

      if (!code) {
        return {
          errorCode: this.ERROR_CODES_getClassByCode.MISSING_PARAM,
          data: null,
          message: this.ERROR_MESSAGES_getClassByCode.MISSING_PARAM,
        };
      }

      const classInfo = await this.classModel
        .findOne({
          code: code,
          deleted_at: null,
        })
        .select('-__v')
        .lean()
        .exec();

      if (!classInfo) {
        return {
          errorCode: this.ERROR_CODES_getClassByCode.CLASS_NOT_FOUND,
          data: null,
          message: this.ERROR_MESSAGES_getClassByCode.CLASS_NOT_FOUND,
        };
      }

      // Format response data
      const classData = {
        id: classInfo._id.toString(),
        name: classInfo.name,
        code: classInfo.code,
        description: classInfo.description,
        created_at: (classInfo as any).created_at,
        updated_at: (classInfo as any).updated_at,
      };

      return {
        errorCode: this.ERROR_CODES_getClassByCode.SUCCESS,
        data: classData,
        message: this.ERROR_MESSAGES_getClassByCode.SUCCESS,
      };
    } catch (error) {
      console.log(error);
      return {
        errorCode: this.ERROR_CODES_getClassByCode.INTERNAL_ERROR,
        data: null,
        message: this.ERROR_MESSAGES_getClassByCode.INTERNAL_ERROR,
      };
    }
  }

  async getClassById(id: string) {
    try {
      if (!id) {
        return {
          errorCode: this.ERROR_CODES_getClassById.MISSING_PARAM,
          data: null,
          message: this.ERROR_MESSAGES_getClassById.MISSING_PARAM,
        };
      }
      // Validate ObjectId
      if (!Types.ObjectId.isValid(id)) {
        return {
          errorCode: this.ERROR_CODES_getClassById.INVALID_ID,
          data: null,
          message: this.ERROR_MESSAGES_getClassById.INVALID_ID,
        };
      }

      const classInfo = await this.classModel
        .findOne({
          _id: new Types.ObjectId(id),
          deleted_at: null,
        })
        .select('-__v')
        .lean()
        .exec();

      if (!classInfo) {
        return {
          errorCode: this.ERROR_CODES_getClassById.ID_NOT_FOUND,
          data: null,
          message: this.ERROR_MESSAGES_getClassById.ID_NOT_FOUND,
        };
      }

      const classData = {
        id: classInfo._id.toString(),
        name: classInfo.name,
        code: classInfo.code,
        description: classInfo.description,
        created_at: (classInfo as any).created_at,
        updated_at: (classInfo as any).updated_at,
      };

      return {
        errorCode: this.ERROR_CODES_getClassById.SUCCESS,
        data: classData,
        message: this.ERROR_MESSAGES_getClassById.SUCCESS,
      };
    } catch (error) {
      return {
        errorCode: this.ERROR_CODES_getClassById.INTERNAL_ERROR,
        data: null,
        message: this.ERROR_MESSAGES_getClassById.INTERNAL_ERROR,
      };
    }
  }

  async create(dto: CreateClassDto) {
    try {
      const created = new this.classModel(dto);
      return await created.save();
    } catch (error: any) {
      // duplicate code
      if (error.code === 11000) {
        throw new BadRequestException('Class code already exists');
      }
      throw error;
    }
  }

  async findAll(query?: any) {
    const { page = 1, limit = 20, name, status } = query;

    const filter: any = { deleted_at: null };

    if (name) {
      const regex = removeAccentsRegex(query.name);
      filter.name = { $regex: regex, $options: 'i' };
    }

    if (status) {
      filter.status = Number(status);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.classModel
        .find(filter)
        .select('-created_at -updated_at -deleted_at')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.classModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
        },
      },
    };
  }

  async findOne(id: string) {
    return this.classModel
      .findById(id)
      .select('-created_at -updated_at -deleted_at')
      .lean();
  }

  async update(id: string, dto: UpdateClassDto) {
    return this.classModel.findByIdAndUpdate(id, dto, { new: true });
  }

  //   async remove(id: string) {
  //     return this.classModel.findByIdAndUpdate(id, {
  //       deleted_at: new Date(),
  //     });
  //   }
  async remove(id: string) {
    // Soft delete class
    await this.classModel.findByIdAndUpdate(id, {
      deleted_at: new Date(),
    });

    // Xóa toàn bộ quan hệ subject-class
    await this.subjectClassModel.deleteMany({
      class_id: id,
    });

    return { message: 'Class deleted and relations removed' };
  }

  async getListClassWithSubjects(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.name?.trim() || '';

    const pipeline: any[] = [
      {
        $match: {
          status: 1,
          deleted_at: null,
          ...(search
            ? { name: { $regex: removeAccentsRegex(search), $options: 'i' } }
            : {}),
        },
      },

      // Join bảng trung gian subject_class
      {
        $lookup: {
          from: 'subjects_classes',
          localField: '_id',
          foreignField: 'class_id',
          as: 'subject_class',
        },
      },

      // Join tiếp bảng subject
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject_class.subject_id',
          foreignField: '_id',
          as: 'subjects',
        },
      },

      // Chỉ lấy subject hợp lệ
      {
        $set: {
          subjects: {
            $filter: {
              input: '$subjects',
              as: 'sub',
              cond: {
                $and: [
                  { $eq: ['$$sub.status', 1] },
                  { $eq: ['$$sub.deleted_at', null] },
                ],
              },
            },
          },
        },
      },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          subjects: {
            _id: 1,
            name: 1,
            code: 1,
          },
        },
      },
    ];

    const data = await this.classModel.aggregate(pipeline);
    const total = await this.classModel.countDocuments({
      status: 1,
      deleted_at: null,
      ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
    });

    return {
      page,
      limit,
      total,
      data,
    };
  }

  async getDetailProgram(classId: string) {
    // Kiểm tra tồn tại lớp
    const classData = await this.classModel
      .findOne({
        _id: classId,
        status: 1,
        deleted_at: null,
      })
      .lean();

    if (!classData) {
      console.log('Class not found');
      return;
    }

    // Lấy subject_class liên quan
    const subjectRelations = await this.subjectClassModel
      .find({
        class_id: new Types.ObjectId(classId),
      })
      .lean();

    const subjectIds = subjectRelations.map((s) => s.subject_id);

    // Lấy subject thực sự
    const subjects = await this.subjectModel
      .find({
        _id: { $in: subjectIds },
        status: 1,
        deleted_at: null,
      })
      .select('_id name code')
      .lean();

    return {
      _id: classData._id,
      name: classData.name,
      code: classData.code,
      subjects,
    };
  }

  async createProgram(class_id: string, subject_ids: string[]) {
    if (!Types.ObjectId.isValid(class_id)) {
      throw new BadRequestException('class_id không hợp lệ');
    }

    const classObjectId = new Types.ObjectId(class_id);

    // Convert tất cả subject_ids sang ObjectId
    const subjectObjectIds = subject_ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    /** -------------------------------
   * 1. Lấy toàn bộ quan hệ hiện tại
   -------------------------------- */
    const existingRelations = await this.subjectClassModel.find({
      class_id: classObjectId,
    });

    const existingSubjectIds = existingRelations.map((r) =>
      r.subject_id.toString(),
    );

    /** -------------------------------
   * 2. Xác định danh sách cần thêm
   -------------------------------- */
    const subjectsToAdd = subjectObjectIds.filter(
      (id) => !existingSubjectIds.includes(id.toString()),
    );

    /** -------------------------------
   * 3. Xác định danh sách cần xóa
   -------------------------------- */
    const subjectsToRemove = existingRelations.filter(
      (r) => !subject_ids.includes(r.subject_id.toString()),
    );

    /** -------------------------------
   * 4. Thêm mới
   -------------------------------- */
    for (const subject_id of subjectsToAdd) {
      await this.subjectClassModel.create({
        class_id: classObjectId,
        subject_id,
      });
    }

    /** -------------------------------
   * 5. Xóa những relation không tồn tại nữa
   -------------------------------- */
    for (const rel of subjectsToRemove) {
      await this.subjectClassModel.deleteOne({
        _id: rel._id,
      });
    }

    return {
      message: 'Cập nhật chương trình học thành công',
      added: subjectsToAdd.map((x) => x.toString()),
      removed: subjectsToRemove.map((x) => x.subject_id.toString()),
    };
  }

  async getClassesBySubject(getClassesBySubjectDto: GetClassesBySubjectDto) {
    try {
      const { subject_id } = getClassesBySubjectDto;
      // Kiểm tra tham số
      if (!subject_id) {
        return {
          errorCode: this.ERROR_CODES_getClassesBySubject.MISSING_PARAM,
          data: null,
          message: this.ERROR_MESSAGES_getClassesBySubject.MISSING_PARAM,
        };
      }
      // Kiểm tra subject_id có hợp lệ không
      if (!Types.ObjectId.isValid(subject_id)) {
        return {
          errorCode: this.ERROR_CODES_getClassesBySubject.INVALID_SUBJECT_ID,
          data: null,
          message: this.ERROR_MESSAGES_getClassesBySubject.INVALID_SUBJECT_ID,
        };
      }

      // Lấy danh sách subject-class mapping
      const subjectClassMappings = await this.subjectClassModel
        .find({ subject_id: new Types.ObjectId(subject_id) })
        .exec();

      if (subjectClassMappings.length === 0) {
        return {
          errorCode: this.ERROR_CODES_getClassesBySubject.NO_CLASSES_FOUND,
          data: [],
          message: this.ERROR_MESSAGES_getClassesBySubject.NO_CLASSES_FOUND,
        };
      }

      // Lấy danh sách class_id từ mapping
      const classIds = subjectClassMappings.map((sc) => sc.class_id);

      // Lấy danh sách môn học (chỉ lấy những môn không bị xóa)
      const classes = await this.classModel
        .find({
          _id: { $in: classIds },
          deleted_at: null,
          status: 1,
        })
        .select('-__v')
        .exec();

      if (classes.length === 0) {
        return {
          errorCode: this.ERROR_CODES_getClassesBySubject.NO_CLASSES_FOUND,
          data: [],
          message: this.ERROR_MESSAGES_getClassesBySubject.NO_CLASSES_FOUND,
        };
      }

      // Format response data
      const formattedClasses = classes.map((item) => ({
        id: item._id,
        name: item.name,
        code: item.code,
        description: item.description,
        // status: item.status,
      }));

      return {
        errorCode: this.ERROR_CODES_getClassesBySubject.SUCCESS,
        data: formattedClasses,
        total: formattedClasses.length,
        message: this.ERROR_MESSAGES_getClassesBySubject.SUCCESS,
      };
    } catch (error) {
      console.error('Error in getSubjectsByClass:', error);
      return {
        errorCode: this.ERROR_CODES_getClassesBySubject.INTERNAL_ERROR,
        data: null,
        message: this.ERROR_MESSAGES_getClassesBySubject.INTERNAL_ERROR,
      };
    }
  }
}
