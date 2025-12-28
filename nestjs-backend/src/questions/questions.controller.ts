import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { GetQuestionsByExamDto } from './dto/get-questions-by-exam.dto';
import { GetQuestionByIdDto } from './dto/get-questions-by-id.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('by-exam')
  async getByExam(@Query() query: GetQuestionsByExamDto) {
    const data = await this.questionsService.findByExamId(query.exam_id, {
      reverseQuestion: query.reverseQuestion,
      reverseAnswer: query.reverseAnswer,
    });
    return {
      success: true,
      total: data?.questions.length,
      data,
    };
  }

  @Get(':id')
  async getById(@Param() param: GetQuestionByIdDto) {
    const data = await this.questionsService.findById(param.id);

    return {
      errorCode: 0,
      data,
      message: 'Thành công',
    };
  }
}
