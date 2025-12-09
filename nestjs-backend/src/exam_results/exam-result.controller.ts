import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ExamResultService } from './exam-result.service';

@ApiTags('Exam Result')
@Controller('exam-result')
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) { }

  @Get('detail')
  @ApiQuery({ name: 'user_id', required: true })
  @ApiQuery({ name: 'exam_id', required: true })
  async getExamResultDetail(
    @Query('user_id') userId: string,
    @Query('exam_id') examId: string,
  ) {
    return this.examResultService.getExamResultDetail(userId, examId);
  }

  @Get('all-detail')
  @ApiQuery({ name: 'user_id', required: true })
  @ApiQuery({ name: 'exam_id', required: true })
  async getAllExamResultDetail(
    @Query('user_id') userId: string,
    @Query('exam_id') examId: string,
  ) {
    return this.examResultService.getAllExamResultDetail(userId, examId);
  }

  // GET /exam-results/:examResultId
  @Get(':examResultId')
  async getExamDetailResult(@Param('examResultId') examResultId: string) {
    return await this.examResultService.getExamDetailResult(examResultId);
  }

}
