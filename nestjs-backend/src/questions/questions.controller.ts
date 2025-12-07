export const a='2';
import { Controller, Get, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { GetQuestionsByExamDto } from './dto/get-questions-by-exam.dto';


@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Get('by-exam')
  async getByExam(@Query() query: GetQuestionsByExamDto) {
    const data = await this.questionsService.findByExamId(
      query.exam_id,
      {
        reverseQuestion: query.reverseQuestion,
        reverseAnswer: query.reverseAnswer
      }
    );
    return {
      success: true,
      total: data?.questions.length,
      data,
    };
  }
}
