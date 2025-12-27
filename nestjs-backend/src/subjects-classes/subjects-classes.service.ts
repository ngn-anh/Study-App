import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// import { GetSubjectsByClassDto } from './dto/get-subjects-by-class.dto';
// import { Subject, SubjectDocument } from './schemas/subjects.schema';
// import { Class, ClassDocument } from 'src/classes/schemas/classes.schema';
import {
    SubjectClass,
    SubjectClassDocument,
} from 'src/subjects-classes/schemas/subjects-classes.schema';
// import { removeAccentsRegex } from 'src/helper';
// import { CreateSubjectDto } from './dto/create-subject.dto';
// import { UpdateSubjectDto } from './dto/update-subject.dto';
import { GetBySubjectClassDto } from './dto/get-by-subjectId-classId.dto';

@Injectable()
export class SubjectsClassesService {
    constructor(
        // @InjectModel(Subject.name)
        // private subjectModel: Model<SubjectDocument>,

        // @InjectModel(Class.name)
        // private classModel: Model<ClassDocument>,
        @InjectModel(SubjectClass.name)
        private subjectClassModel: Model<SubjectClassDocument>,
    ) { }

    async getBySubjectClass(getBySubjectClassDto: GetBySubjectClassDto) {
        try {
            const { class_id, subject_id } = getBySubjectClassDto;

            // // Kiểm tra tham số
            // if (!class_id) {
            //     return {
            //         errorCode: this.ERROR_CODES.MISSING_PARAM,
            //         data: null,
            //         message: this.ERROR_MESSAGES.MISSING_PARAM,
            //     };
            // }

            // // Kiểm tra class_id có hợp lệ không
            // if (!Types.ObjectId.isValid(class_id)) {
            //     return {
            //         errorCode: this.ERROR_CODES.INVALID_CLASS_ID,
            //         data: null,
            //         message: this.ERROR_MESSAGES.INVALID_CLASS_ID,
            //     };
            // }

            // Lấy danh sách subject-class mapping
            const subjectClassMappings = await this.subjectClassModel
                .find({ class_id: new Types.ObjectId(class_id), subject_id: new Types.ObjectId(subject_id) })
                .exec();

            if (subjectClassMappings.length === 0) {
                console.log("không tìm thấy mapping")
                return {
                    // errorCode: this.ERROR_CODES.NO_SUBJECTS_FOUND,
                    // data: [],
                    // message: this.ERROR_MESSAGES.NO_SUBJECTS_FOUND,
                };
            }

            return {
                errorCode: 0,
                data: subjectClassMappings,
                total: subjectClassMappings.length,
                message: "Thành công",
            };
        } catch (error) {
            console.error('Error in getSubjectsByClass:', error);
            return {
                errorCode: 500,
                data: null,
                message: "Hệ thống bận",
            };
        }
    }
}