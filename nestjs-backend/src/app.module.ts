import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ReminderSchedulesModule } from './reminder-schedules/reminder-schedules.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamResultModule } from './exam_results/exam-result.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ClassesModule } from './classes/classes.module';
import { LikeExamModule } from './like-exam/like-exam.module';
import { PdfModule } from './pdf/pdf.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),           // Load .env
    // MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/Mobile'),      // Kết nối MongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/DATN'),
    UsersModule,
    AuthModule,
    ReminderSchedulesModule,
    ExamsModule,
    QuestionsModule,
    ExamResultModule,
    SubjectsModule,
    ClassesModule,
    LikeExamModule,
    PdfModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
