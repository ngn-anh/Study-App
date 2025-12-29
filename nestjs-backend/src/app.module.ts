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
import { NotificationTypesModule } from './notification-types/notification-types.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from '@nestjs/bull';
import { ClassesModule } from './classes/classes.module';
import { LikeExamModule } from './like-exam/like-exam.module';
import { PdfModule } from './pdf/pdf.module';
// import { ClassModule } from './classes/class.module';
import { NotificationSettingModule } from './notification-setting/notification-setting.module';
// import { SubjectModule } from './subjects/subject.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { SubjectsClassesModule } from './subjects-classes/subjects-classes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/StudyApp',
    ), // Kết nối MongoDB
    // MongooseModule.forRoot('mongodb://localhost:27017/StudyApp'),
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    UsersModule,
    AuthModule,
    ReminderSchedulesModule,
    ExamsModule,
    QuestionsModule,
    ExamResultModule,
    SubjectsModule,
    NotificationTypesModule,
    NotificationsModule,
    ClassesModule,
    LikeExamModule,
    PdfModule,
    // ClassModule,
    NotificationSettingModule,
    // SubjectsModule,
    // SubjectModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    SubjectsClassesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
