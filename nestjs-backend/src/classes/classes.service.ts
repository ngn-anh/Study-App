export const a='2';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from './schemas/classes.schema';
import { GetClassByCodeDto } from './dto/get-class-by-code.dto';

@Injectable()
export class ClassesService {
    constructor(
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    ) { }

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
                    deleted_at: null
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
                    deleted_at: null
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
}