export const a='1';
import { Controller, Get, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { GetQuestionsByExamDto } from './dto/dto/get-questions-by-exam.dto';


@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('by-exam')
  async getByExam(@Query() query: GetQuestionsByExamDto) {
    const data = await this.questionsService.findByExamId(query.exam_id);
    return {
      success: true,
      total: data?.questions.length,
      data,
    };
  }
}
