import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassDocument } from './schemas/classes.schema';
import { removeAccentsRegex } from 'src/helper';
import { SubjectClass, SubjectClassDocument } from 'src/subject-classes/schemas/subject-class.schema';
import { Subject, SubjectDocument } from 'src/subjects/schema/subjects.schema';

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

    const search = query.name?.trim() || "";

    const pipeline: any[] = [
      {
        $match: {
          status: 1,
          deleted_at: null,
          ...(search
            ? { name: { $regex: removeAccentsRegex(search), $options: "i" } }
            : {})
        }
      },

      // Join bảng trung gian subject_class
      {
        $lookup: {
          from: "subject_classes",
          localField: "_id",
          foreignField: "class_id",
          as: "subject_class"
        }
      },

      // Join tiếp bảng subject
      {
        $lookup: {
          from: "subjects",
          localField: "subject_class.subject_id",
          foreignField: "_id",
          as: "subjects"
        }
      },

      // Chỉ lấy subject hợp lệ
      {
        $set: {
          subjects: {
            $filter: {
              input: "$subjects",
              as: "sub",
              cond: {
                $and: [
                  { $eq: ["$$sub.status", 1] },
                  { $eq: ["$$sub.deleted_at", null] }
                ]
              }
            }
          }
        }
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
          }
        }
      }
    ];

    const data = await this.classModel.aggregate(pipeline);
    const total = await this.classModel.countDocuments({
      status: 1,
      deleted_at: null,
      ...(search ? { name: { $regex: search, $options: "i" } } : {})
    });

    return {
      page,
      limit,
      total,
      data
    };
  }

  async getDetailProgram(classId: string) {
    // Kiểm tra tồn tại lớp
    const classData = await this.classModel.findOne({
      _id: classId,
      status: 1,
      deleted_at: null
    }).lean();

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    // Lấy subject_class liên quan
    const subjectRelations = await this.subjectClassModel.find({
      class_id: new Types.ObjectId(classId),
    }).lean();

    const subjectIds = subjectRelations.map(s => s.subject_id);

    // Lấy subject thực sự
    const subjects = await this.subjectModel.find({
      _id: { $in: subjectIds },
      status: 1,
      deleted_at: null
    }).select('_id name code').lean();

    return {
      _id: classData._id,
      name: classData.name,
      code: classData.code,
      subjects
    };
  }

  async createProgram(class_id: string, subject_ids: string[]) {
  if (!Types.ObjectId.isValid(class_id)) {
    throw new BadRequestException('class_id không hợp lệ');
  }

  const classObjectId = new Types.ObjectId(class_id);

  // Convert tất cả subject_ids sang ObjectId
  const subjectObjectIds = subject_ids
    .filter(id => Types.ObjectId.isValid(id))
    .map(id => new Types.ObjectId(id));

  /** -------------------------------
   * 1. Lấy toàn bộ quan hệ hiện tại
   -------------------------------- */
  const existingRelations = await this.subjectClassModel.find({
    class_id: classObjectId,
  });

  const existingSubjectIds = existingRelations.map(r => r.subject_id.toString());

  /** -------------------------------
   * 2. Xác định danh sách cần thêm
   -------------------------------- */
  const subjectsToAdd = subjectObjectIds.filter(
    id => !existingSubjectIds.includes(id.toString())
  );

  /** -------------------------------
   * 3. Xác định danh sách cần xóa
   -------------------------------- */
  const subjectsToRemove = existingRelations.filter(
    r => !subject_ids.includes(r.subject_id.toString())
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
    message: "Cập nhật chương trình học thành công",
    added: subjectsToAdd.map(x => x.toString()),
    removed: subjectsToRemove.map(x => x.subject_id.toString()),
  };
}
}