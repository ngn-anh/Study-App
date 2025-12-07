// src/like-exam/like-exam.controller.ts
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { LikeExamDto } from './dto/like-exam.dto';
import { LikeExamService } from './like-exam.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('LikeExam')
@Controller('like-exam')
export class LikeExamController {
    constructor(private readonly likeExamService: LikeExamService) { }

    @Post()
    async toggleLike(@Body() likeExamDto: LikeExamDto) {
        const result = await this.likeExamService.toggleLike(likeExamDto);
        return result;
    }
}