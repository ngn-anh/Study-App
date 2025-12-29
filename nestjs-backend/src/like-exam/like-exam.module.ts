import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeExam, LikeExamSchema } from './schemas/like-exam.schema';
import { LikeExamController } from './like-exam.controller';
import { LikeExamService } from './like-exam.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LikeExam.name, schema: LikeExamSchema },
    ]),
  ],
  controllers: [LikeExamController],
  providers: [LikeExamService],
  exports: [LikeExamService],
})
export class LikeExamModule {}
