import { Body, Controller, Post } from '@nestjs/common';
import { LikeExamDto } from './dto/like-exam.dto';
import { LikeExamService } from './like-exam.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LikeExam')
@Controller('exams')
export class LikeExamController {
  constructor(private readonly likeExamService: LikeExamService) {}

  @Post('like')
  async toggleLike(@Body() likeExamDto: LikeExamDto) {
    const result = await this.likeExamService.toggleLike(likeExamDto);
    return result;
  }
}
