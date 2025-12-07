import {
  Controller,
  Get,
  Query,
  Param,
  Res,
  Header,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { Response } from 'express';
import { GetQuestionsByExamDto } from './dto/get-questions-by-exam.dto';
import { PdfService } from './pdf.service';

@Controller('download-pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) { }

  // API để xem dữ liệu câu hỏi dạng JSON (giữ nguyên)
  @Get('questions/by-exam')
  async getByExam(@Query() query: GetQuestionsByExamDto) {
    const data = await this.pdfService.findByExamId(query.exam_id);

    if (!data) {
      throw new NotFoundException('Exam not found');
    }

    return {
      success: true,
      total: data.questions.length,
      data,
    };
  }

  // API để tải PDF đề thi
  @Get('exam/:examIdss/pdf')
  @Header('Content-Type', 'application/pdf')
  async downloadExamPdf(
    @Param('examId') examId: string,
    // @Res() res: Response,
  ) {
    // try {
    //   // 1. Lấy dữ liệu đề thi
    //   const examData = await this.pdfService.findByExamId(examId);

    //   if (!examData) {
    //     throw new NotFoundException('Exam not found');
    //   }

    //   // 2. Tạo PDF
    //   const pdfBuffer = await this.pdfService.generateExamPdf(examData);

    //   // 3. Tạo tên file
    //   const examName = examData.exam.name.replace(/[^a-zA-Z0-9À-ỹ\s]/g, '').replace(/\s+/g, '_');
    //   const filename = `${examName}_${Date.now()}.pdf`;

    //   // 4. Thiết lập response headers
    //   res.set({
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    //     'Content-Length': pdfBuffer.length,
    //     'Cache-Control': 'no-cache, no-store, must-revalidate',
    //     'Pragma': 'no-cache',
    //     'Expires': '0',
    //   });

    //   // 5. Gửi PDF
    //   res.send(pdfBuffer);

    // } catch (error) {
    //   console.error('Error generating PDF:', error);

    //   if (error instanceof NotFoundException) {
    //     throw error;
    //   }

    //   throw new InternalServerErrorException('Failed to generate PDF');
    // }
  }

  // API để xem trước PDF (không tải xuống ngay)
  @Get('exam/:examId/preview')
  @Header('Content-Type', 'application/pdf')
  async previewExamPdf(
    @Param('examId') examId: string,
    // @Res() res: Response,
  ) {
    // try {
    //   const examData = await this.pdfService.findByExamId(examId);

    //   if (!examData) {
    //     throw new NotFoundException('Exam not found');
    //   }

    //   const pdfBuffer = await this.pdfService.generateExamPdf(examData);
    //   const examName = examData.exam.name.replace(/[^a-zA-Z0-9À-ỹ\s]/g, '').replace(/\s+/g, '_');

    //   res.set({
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `inline; filename="${encodeURIComponent(examName)}.pdf"`,
    //     'Content-Length': pdfBuffer.length,
    //   });

    //   res.send(pdfBuffer);

    // } catch (error) {
    //   console.error('Error previewing PDF:', error);

    //   if (error instanceof NotFoundException) {
    //     throw error;
    //   }

    //   throw new InternalServerErrorException('Failed to preview PDF');
    // }
  }
}