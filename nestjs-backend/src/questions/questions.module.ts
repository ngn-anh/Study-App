import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question, QuestionSchema } from './schemas/questions.schema';
import { AnswerQuestion, AnswerQuestionSchema } from 'src/answer-questions/schemas/answer-questions.schema';
import { Exam, ExamSchema } from 'src/exams/schemas/exams.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: AnswerQuestion.name, schema: AnswerQuestionSchema },
      { name: Exam.name, schema: ExamSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
