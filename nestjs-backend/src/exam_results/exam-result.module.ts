import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResultService } from './exam-result.service';
import { ExamResult, ExamResultSchema } from './schemas/exam_results.schema';
import { ExamResultAnswer, ExamResultAnswerSchema } from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import { ExamResultController } from './exam-result.controller';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: ExamResultAnswer.name, schema: ExamResultAnswerSchema },
    ]),
  ],
  controllers: [ExamResultController],
  providers: [ExamResultService],
  exports: [ExamResultService],
})
export class ExamResultModule {}
