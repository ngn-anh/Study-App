export const a='2';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam, ExamSchema } from './schemas/exams.schema';
import { SubjectClass, SubjectClassSchema } from 'src/subjects-classes/schemas/subjects-classes.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { Subject } from 'rxjs';
import { SubjectSchema } from 'src/subjects/schemas/subjects.schema';
import { ExamResult, ExamResultSchema } from 'src/exam_results/schemas/exam_results.schema';
import { ExamResultAnswer, ExamResultAnswerSchema } from 'src/exam_result_answers/schemas/exam_result_answers.schema';
import { Question, QuestionSchema } from 'src/questions/schemas/questions.schema';
import { LikeExam, LikeExamSchema } from 'src/like-exam/schemas/like-exam.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    MongooseModule.forFeature([{ name: SubjectClass.name, schema: SubjectClassSchema }]),
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: LikeExam.name, schema: LikeExamSchema }]),
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: ExamResultAnswer.name, schema: ExamResultAnswerSchema },
    ]),
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule { }
