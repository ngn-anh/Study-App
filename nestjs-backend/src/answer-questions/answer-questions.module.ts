// src/answers/answers.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersController } from './answer-questions.controller';
import { AnswersService } from './answer-questions.service';
import { AnswerQuestion, AnswerQuestionSchema } from './schemas/answer-questions.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: AnswerQuestion.name, schema: AnswerQuestionSchema }]),
    ],
    providers: [AnswersService],
    controllers: [AnswersController],
    exports: [AnswersService, MongooseModule],
})
export class AnswersModule { }