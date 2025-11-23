import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassDocument } from './schemas/classes.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name)
    private classModel: Model<ClassDocument>,
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

  async findAll() {
    return this.classModel
        .find({ deleted_at: null })
        .select('-created_at -updated_at -deleted_at')
        .sort({ created_at: -1 })
        .lean();
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
    return this.classModel.findByIdAndUpdate(id, {
      deleted_at: new Date(),
    });
  }
}
