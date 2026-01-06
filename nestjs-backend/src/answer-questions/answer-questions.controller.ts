// src/answers/answers.controller.ts
import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Put,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AnswersService } from './answer-questions.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('answers')
export class AnswersController {
    constructor(private readonly answersService: AnswersService) { }

    // -------- Tạo đáp án --------
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Body() dto: CreateAnswerDto) {
        const data = await this.answersService.create(dto);
        return { success: true, data };
    }

    // // -------- Lấy danh sách đáp án theo question_id --------
    // @Get('by-question/:questionId')
    // async getByQuestion(@Param('questionId') qId: string) {
    //     const data = await this.answersService.findByQuestionId(qId);
    //     return { success: true, total: data.length, data };
    // }

    // // -------- Cập nhật --------
    // @Put(':id')
    // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    // async update(@Param('id') id: string, @Body() dto: Partial<CreateAnswerDto>) {
    //     const data = await this.answersService.update(id, dto);
    //     return { success: true, data };
    // }

    // // -------- Soft‑delete --------
    // @Delete(':id')
    // async softDelete(@Param('id') id: string) {
    //     await this.answersService.softDelete(id);
    //     return { success: true };
    // }

    // // -------- Hard delete (nếu muốn) --------
    // @Delete('hard/:id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // async hardDelete(@Param('id') id: string) {
    //     await this.answersService.hardDelete(id);
    // }
}