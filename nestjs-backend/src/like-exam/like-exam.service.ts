import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LikeExam, LikeExamDocument } from './schemas/like-exam.schema';
import { LikeExamDto } from './dto/like-exam.dto';

@Injectable()
export class LikeExamService {
  constructor(
    @InjectModel(LikeExam.name)
    private readonly likeExamModel: Model<LikeExamDocument>,
  ) {}

  async toggleLike(likeExamDto: LikeExamDto) {
    const { user_id, exam_id, is_liked } = likeExamDto;
    const userObjectId = new Types.ObjectId(user_id);
    const examObjectId = new Types.ObjectId(exam_id);

    if (is_liked === 0) {
      try {
        const created = await this.likeExamModel.create({
          user_id: userObjectId,
          exam_id: examObjectId,
        });
        return {
          errorCode: 0,
          data: created,
          message: 'Like thành công.',
        };
      } catch (err) {
        if (err.code === 11000) {
          throw new BadRequestException('Bạn đã like đề thi này rồi.');
        }
        throw err;
      }
    }

    const deleted = await this.likeExamModel.findOneAndDelete({
      user_id: userObjectId,
      exam_id: examObjectId,
    });

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy bản ghi like để xóa.');
    }

    return {
      errorCode: 0,
      data: deleted,
      message: 'Dislike thành công',
    };
  }

  async countLikesByExam(examId: string): Promise<number> {
    const examObjectId = new Types.ObjectId(examId);
    return this.likeExamModel.countDocuments({ exam_id: examObjectId }).exec();
  }
}
