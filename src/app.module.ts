import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),           // Load .env
    MongooseModule.forRoot(process.env.MONGO_URI ||  'mongodb://localhost:27017/nestjs_db'),      // Kết nối MongoDB
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
