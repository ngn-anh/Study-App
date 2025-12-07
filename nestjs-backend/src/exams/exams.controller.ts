import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { ExamsFilterDto } from './dto/exams-filter.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { GetExamRankDto } from './dto/get-exam-rank.dto';
import { InfoExamDto } from './dto/info-exam.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  @Get()
  async getExams(@Query() filterDto: ExamsFilterDto) {
    console.log('filterDto', filterDto)
    return this.examsService.getExams(filterDto);
  }

  @Post('submit')
  async submit(@Body() dto: SubmitExamDto) {
    return this.examsService.submitExam(dto);
  }

  // @Get(':id/info')
  // async getExamInfo(@Param('id') id: string) {
  //   return this.examsService.getExamInfo(id);
  // }

  @Get(':id/info')
  @ApiQuery({ name: 'user_id', required: false, type: String }) // (tùy, không bắt buộc)
  @ApiQuery({ type: InfoExamDto })
  async getExamInfo(
    @Param('id') id: string,
    @Query() dto: InfoExamDto,
  ) {
    return this.examsService.getExamInfo(id, dto.user_id);
  }

  @Get('rank')
  async getExamRank(@Query() query: GetExamRankDto) {
    console.log('query', query)
    return this.examsService.getExamRank(query);
  }
}
