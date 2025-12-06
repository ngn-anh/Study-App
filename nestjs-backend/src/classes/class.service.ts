import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassDocument } from './schemas/classes.schema';
import { removeAccentsRegex } from 'src/helper';
import { SubjectClass, SubjectClassDocument } from 'src/subject-classes/schemas/subject-class.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name)
    private classModel: Model<ClassDocument>,

    @InjectModel(SubjectClass.name)
    private subjectClassModel: Model<SubjectClassDocument>,
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
}
