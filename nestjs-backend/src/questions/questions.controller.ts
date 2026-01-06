import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { GetQuestionsByExamDto } from './dto/get-questions-by-exam.dto';
import { GetQuestionByIdDto } from './dto/get-questions-by-id.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateManyQuestionDto } from './dto/create-many-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

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

  @Post('create')
  async create(@Body() dto: CreateQuestionDto) {
    try {
      const result = await this.questionsService.createQuestion(dto);
      return {
        success: true,
        data: result,
      };
    } catch (err) {
      return {
        success: false,
        data: {},
      };
    }
  }

  @Post('create-many')
  async createMany(@Body() dto: CreateManyQuestionDto) {
    const result = await this.questionsService.createManyQuestions(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Patch('update/:id')
  async update(
    @Param() param: GetQuestionByIdDto,
    @Body() dto: UpdateQuestionDto,
  ) {
    const data = await this.questionsService.updateQuestion(param.id, dto);
    return {
      success: true,
      data,
    };
  }

  // @Patch('delete/:id')
  // async softDelete(@Param() param: GetQuestionByIdDto) {
  //   await this.questionsService.softDeleteQuestion(param.id);
  //   return {
  //     success: true,
  //   };
  // }
}
