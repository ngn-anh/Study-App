import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam, ExamSchema } from './schemas/exams.schema';
import { SubjectClass, SubjectClassSchema } from 'src/subject-classes/schemas/subject-class.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { Subject } from 'rxjs';
import { SubjectSchema } from 'src/subjects/schema/subjects.schema';
import { ExamResult, ExamResultSchema } from 'src/exam_results/schemas/exam_results.schema';
import { ExamResultAnswer, ExamResultAnswerSchema } from 'src/exam_result_answers/schemas/exam_result_answers.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    MongooseModule.forFeature([{ name: SubjectClass.name, schema: SubjectClassSchema }]),
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),      
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),  
     MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: ExamResultAnswer.name, schema: ExamResultAnswerSchema },
    ]),
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
