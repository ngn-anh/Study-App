import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ReminderSchedulesModule } from './reminder-schedules/reminder-schedules.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamResultModule } from './exam_results/exam-result.module';
import { NotificationTypesModule } from './notification-types/notification-types.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),           // Load .env
    MongooseModule.forRoot(process.env.MONGO_URI ||  'mongodb://localhost:27017/nestjs_db'),      // Kết nối MongoDB
    UsersModule,
    AuthModule,
    ReminderSchedulesModule,
    ExamsModule,
    QuestionsModule,
    ExamResultModule,
    NotificationTypesModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
