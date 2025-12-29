import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SubjectClass,
  SubjectClassDocument,
} from 'src/subjects-classes/schemas/subjects-classes.schema';
import { GetBySubjectClassDto } from './dto/get-by-subjectId-classId.dto';

@Injectable()
export class SubjectsClassesService {
  constructor(
    @InjectModel(SubjectClass.name)
    private subjectClassModel: Model<SubjectClassDocument>,
  ) {}

  async getBySubjectClass(getBySubjectClassDto: GetBySubjectClassDto) {
    try {
      const { class_id, subject_id } = getBySubjectClassDto;

      if (!class_id || !subject_id) {
        return {
          errorCode: 1,
          data: {},
          message: 'class_id hoặc subject_id không hợp lệ',
        };
      }

      // Lấy subject-class mapping
      const subjectClassMapping = await this.subjectClassModel
        .findOne({
          class_id: new Types.ObjectId(class_id),
          subject_id: new Types.ObjectId(subject_id),
        })
        .exec();

      if (!subjectClassMapping) {
        console.log('không tìm thấy mapping');
        return {
          errorCode: 1,
          data: {},
          message: 'Không tìm thấy subject-class hợp lệ',
        };
      }

      return {
        errorCode: 0,
        data: subjectClassMapping,
        message: 'Thành công',
      };
    } catch (error) {
      console.error('Error in getSubjectsByClass:', error);
      return {
        errorCode: 500,
        data: null,
        message: 'Hệ thống bận',
      };
    }
  }
}
