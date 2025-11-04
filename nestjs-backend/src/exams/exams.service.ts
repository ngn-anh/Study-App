import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamsFilterDto, ExamStatus, SortOrder } from './dto/exams-filter.dto';
import { Exam, ExamDocument } from './schemas/exams.schema';
import { SubjectClass, SubjectClassDocument } from '../subject-classes/schemas/subject-class.schema';
import { Subject, SubjectDocument } from 'src/subjects/schema/subjects.schema';
import { Class, ClassDocument } from 'src/classes/schemas/classes.schema';


@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(SubjectClass.name) private subjectClassModel: Model<SubjectClassDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async getExams(filterDto: ExamsFilterDto) {
    const {
      status,
      name,
      sort,
      type,
      currentClassCode,
      subjectCodes,
      page = 1,
      limit = 10,
    } = filterDto;

    const now = new Date();

    // 1️⃣ Lấy class_id từ code của user
    let classId: string | null = null;
    if (currentClassCode) {
      const classDoc = await this.classModel
        .findOne({ code: currentClassCode })
        .select('_id')
        .lean();
      if (!classDoc) return { data: [], total: 0, page, limit };
      classId = classDoc._id.toString();
    }
    console.log('classId',classId)

    // 2️⃣ Lấy subject_ids từ mảng subjectCodes
    let subjectIds: string[] = [];
    if (subjectCodes && subjectCodes.length > 0) {
      const subjectDocs = await this.subjectModel
        .find({ code: { $in: subjectCodes } })
        .select('_id')
        .lean();
      subjectIds = subjectDocs.map(s => s._id.toString());
    }

    // 3️⃣ Tìm subject_class_id thỏa mãn class_id và subject_id
    let subjectClassIds: string[] = [];
    if (classId) {
       const classObjectId = new Types.ObjectId(classId);

        const query: any = { class_id: classObjectId };
      // Nếu có subjectIds thì chuyển tất cả sang ObjectId
  if (subjectIds.length > 0) {
    const subjectObjectIds = subjectIds.map(id => new Types.ObjectId(id));
    query.subject_id = { $in: subjectObjectIds };
  }
      console.log('query',query)

      const subjectClassDocs = await this.subjectClassModel
        .find(query)
        .select('_id')
        .lean();
    
        console.log('subjectClassDocs',subjectClassDocs)
      subjectClassIds = subjectClassDocs.map(sc => sc._id.toString());

      if (subjectClassIds.length === 0)
        return { data: [], total: 0, page, limit };
    }
    console.log('subjectClassIds',subjectClassIds)

    // 4️⃣ Tìm exams với subject_class_id
    const examQuery: any = {};
   if (subjectClassIds.length > 0) {
  const subjectClassObjectIds = subjectClassIds.map(id => new Types.ObjectId(id));
  examQuery.subject_class_id = { $in: subjectClassObjectIds };
}

    // Filter theo trạng thái
    if (status === ExamStatus.ONGOING) {
      examQuery.start_date = { $lte: now };
      examQuery.end_date = { $gte: now };
    } else if (status === ExamStatus.UPCOMING) {
      examQuery.start_date = { $gt: now };
    }

    // Filter theo type
    if (type) examQuery.type = type;

    // Filter theo name
     if (name) {
        examQuery.name = { $regex: name, $options: 'i' };
      }


    // Sort
    let sortOption: any = {};
    if (sort === SortOrder.NEWEST) sortOption = { start_date: -1 };
    else if (sort === SortOrder.OLDEST) sortOption = { start_date: 1 };

    const skip = (page - 1) * limit;

    console.log('examQuery',examQuery)
    const [data, total] = await Promise.all([
      this.examModel
        .find(examQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
         .populate({
          path: 'subject_class_id',
          select: '_id subject_id',
          populate: {
            path: 'subject_id',
            select: 'code name',
          },
        })
        .lean(),
      this.examModel.countDocuments(examQuery),
    ]);

    // Map lại data để trả về subject: { code, name }
    const mappedData = (data as any[]).map(exam => {
      const subject = exam.subject_class_id?.subject_id
        ? {
            code: exam.subject_class_id.subject_id.code,
            name: exam.subject_class_id.subject_id.name,
          }
        : null;

      return {
        ...exam,
        subject,
        subject_class_id: undefined,
      };
    });

  return { data: mappedData, total, page, limit };
  }
}
