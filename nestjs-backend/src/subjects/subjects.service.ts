import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetSubjectsByClassDto } from './dto/get-subjects-by-class.dto';
import { Subject, SubjectDocument } from './schemas/subjects.schema';
import { Class, ClassDocument } from 'src/classes/schemas/classes.schema';
import { SubjectClass, SubjectClassDocument } from 'src/subjects-classes/schemas/subjects-classes.schema';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
        @InjectModel(SubjectClass.name) private subjectClassModel: Model<SubjectClassDocument>,
    ) { }

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
            const formattedSubjects = subjects.map(subject => ({
                id: subject._id,
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

}