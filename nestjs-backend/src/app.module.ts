import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ReminderSchedulesModule } from './reminder-schedules/reminder-schedules.module';
import { ExamsModule } from './exams/exams.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),           // Load .env
    MongooseModule.forRoot(process.env.MONGO_URI ||  'mongodb://localhost:27017/nestjs_db'),      // Kết nối MongoDB
    UsersModule,
    AuthModule,
    ReminderSchedulesModule,
    ExamsModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
