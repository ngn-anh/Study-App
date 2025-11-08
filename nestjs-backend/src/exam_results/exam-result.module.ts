import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResultService } from './exam-result.service';
import { ExamResult, ExamResultSchema } from './schemas/exam_results.schema';
import { ExamResultAnswer, ExamResultAnswerSchema } from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import { ExamResultController } from './exam-result.controller';
import { AnswerQuestion, AnswerQuestionSchema } from 'src/answer-questions/schemas/answer-questions.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/questions.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: ExamResultAnswer.name, schema: ExamResultAnswerSchema },
      { name: AnswerQuestion.name, schema: AnswerQuestionSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [ExamResultController],
  providers: [ExamResultService],
  exports: [ExamResultService],
})
export class ExamResultModule {}
