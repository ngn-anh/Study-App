import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/questions.schema';
import { AnswerQuestion, AnswerQuestionDocument } from 'src/answer-questions/schemas/answer-questions.schema';
import { Exam, ExamDocument } from 'src/exams/schemas/exams.schema';
// import { shuffleArray } from 'src/utils';
// import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(AnswerQuestion.name) private answerModel: Model<AnswerQuestionDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) { }

  async findByExamId(
    examId: string,
  ) {

    // Lấy thông tin exam
    const exam = await this.examModel
      .findById(examId)
      .select('_id name type difficulty duration')
      .lean();

    if (!exam) {
      return null;
    }

    // Lấy câu hỏi
    const questions = await this.questionModel
      .find({ exam_id: new Types.ObjectId(examId), deleted_at: null })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    const questionIds = questions.map(q => q._id);

    // Lấy đáp án
    const answers = await this.answerModel
      .find({ question_id: { $in: questionIds }, deleted_at: null })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    let questionsWithAnswers = questions.map(q => {
      let questionAnswers = answers.filter(a => a.question_id.toString() === q._id.toString());
      return {
        ...q,
        answers: questionAnswers,
      };
    });

    // Trả về exam + questions
    return {
      exam,
      questions: questionsWithAnswers,
    };
  }

  // async generateExamPdf(examData: any): Promise<Buffer> {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const chunks: Buffer[] = [];
  //       const doc = new PDFDocument({
  //         margin: 50,
  //         size: 'A4',
  //         font: 'Helvetica',
  //       });

  //       // Pipe vào buffer
  //       doc.on('data', chunk => chunks.push(chunk));
  //       doc.on('end', () => resolve(Buffer.concat(chunks)));
  //       doc.on('error', reject);

  //       // 1. Header - Thông tin đề thi
  //       this.addHeader(doc, examData.exam);
  //       this.addInstructions(doc);
  //       // 2. Questions - Chỉ hiển thị câu hỏi và đáp án
  //       this.addQuestions(doc, examData.questions);

  //       // 3. Footer
  //       this.addFooter(doc, examData.questions.length);

  //       doc.end();
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  // private addHeader(doc: PDFKit.PDFDocument, exam: any): void {
  //   // Tiêu đề đề thi
  //   doc.fontSize(20)
  //     .font('Helvetica-Bold')
  //     .fillColor('#2c3e50')
  //     .text(exam.name, { align: 'center' });

  //   doc.moveDown(1);

  //   // Thông tin đề thi
  //   doc.fontSize(10)
  //     .font('Helvetica')
  //     .fillColor('#34495e');

  //   doc.text(`Mã đề: ${exam._id}`);

  //   if (exam.duration) {
  //     doc.text(`Thời gian: ${exam.duration} phút`);
  //   }

  //   doc.moveDown(2);
  // }

  // private addFooter(doc: PDFKit.PDFDocument, totalQuestions: number): void {
  //   const pageCount = doc.bufferedPageRange().count;

  //   for (let i = 0; i < pageCount; i++) {
  //     doc.switchToPage(i);

  //     // Footer info
  //     const footerText = `Trang ${i + 1}/${pageCount} | Tổng số câu: ${totalQuestions}`;

  //     doc.fontSize(8)
  //       .font('Helvetica')
  //       .fillColor('#95a5a6')
  //       .text(
  //         footerText,
  //         50,
  //         doc.page.height - 30,
  //         { align: 'center', width: doc.page.width - 100 }
  //       );
  //   }
  // }

  // private addInstructions(doc: PDFKit.PDFDocument): void {
  //   doc.fontSize(12)
  //     .font('Helvetica-Bold')
  //     .fillColor('#2c3e50')
  //     .text('HƯỚNG DẪN LÀM BÀI:');

  //   doc.fontSize(10)
  //     .font('Helvetica')
  //     .fillColor('#2c3e50')
  //     .text('• Chọn một đáp án đúng nhất cho mỗi câu hỏi.');
  //   doc.text('• Câu hỏi có thể có một hoặc nhiều đáp án đúng.');
  //   doc.text('• Đọc kỹ câu hỏi trước khi chọn đáp án.');

  //   doc.moveDown(2);
  //   this.addSeparator(doc);
  // }

  // private addQuestions(doc: PDFKit.PDFDocument, questions: any[]): void {
  //   // Tiêu đề phần câu hỏi
  //   doc.fontSize(16)
  //     .font('Helvetica-Bold')
  //     .fillColor('#2c3e50')
  //     .text('PHẦN CÂU HỎI', { align: 'center' });

  //   doc.moveDown(1.5);

  //   // Duyệt qua từng câu hỏi
  //   questions.forEach((question, index) => {
  //     this.addSingleQuestion(doc, question, index + 1);

  //     // Thêm khoảng cách giữa các câu hỏi
  //     if (index < questions.length - 1) {
  //       doc.moveDown(1);
  //     }
  //   });
  // }

  // private addSingleQuestion(doc: PDFKit.PDFDocument, question: any, questionNumber: number): void {
  //   // Kiểm tra nếu cần sang trang mới
  //   if (doc.y > doc.page.height - 200) {
  //     doc.addPage();
  //   }

  //   // Số câu hỏi
  //   doc.fontSize(12)
  //     .font('Helvetica-Bold')
  //     .fillColor('#2c3e50')
  //     .text(`Câu ${questionNumber}:`);

  //   // Hiển thị hình ảnh nếu có (chỉ hiển thị URL text, không render ảnh trong PDF)
  //   if (question.image) {
  //     doc.fontSize(10)
  //       .font('Helvetica-Oblique')
  //       .fillColor('#7f8c8d')
  //       .text(`Hình ảnh: ${question.image}`);
  //     doc.moveDown(0.5);
  //   }

  //   // Hiển thị nội dung câu hỏi (description thay vì content)
  //   doc.fontSize(12)
  //     .font('Helvetica')
  //     .fillColor('#34495e')
  //     .text(question.description || question.content || '');

  //   doc.moveDown(0.5);

  //   // Hiển thị thông tin phụ nếu có
  //   const additionalInfo = [];
  //   if (question.difficulty) {
  //     additionalInfo.push(`Độ khó: ${question.difficulty}`);
  //   }
  //   if (question.section) {
  //     additionalInfo.push(`Phần: ${question.section}`);
  //   }

  //   if (additionalInfo.length > 0) {
  //     doc.fontSize(9)
  //       .font('Helvetica-Oblique')
  //       .fillColor('#7f8c8d')
  //       .text(`(${additionalInfo.join(' | ')})`);
  //     doc.moveDown(0.5);
  //   }

  //   // Hiển thị các đáp án (CHỈ hiển thị description, KHÔNG hiển thị is_correct, explanation, image)
  //   doc.fontSize(11)
  //     .font('Helvetica')
  //     .fillColor('#34495e');

  //   if (question.answers && question.answers.length > 0) {
  //     // Sắp xếp answers theo _id hoặc giữ nguyên thứ tự
  //     const sortedAnswers = [...question.answers];

  //     // Hiển thị với label A, B, C, D
  //     sortedAnswers.forEach((answer: any, index: number) => {
  //       const label = String.fromCharCode(65 + index); // A, B, C, D

  //       // Tạo text cho đáp án
  //       let answerText = `   ${label}. ${answer.description || answer.content || ''}`;

  //       // Thêm thông tin hình ảnh nếu có (chỉ text URL)
  //       if (answer.image) {
  //         answerText += ` [có hình ảnh]`;
  //       }

  //       doc.text(answerText);
  //     });
  //   } else {
  //     doc.text('   (Không có đáp án)');
  //   }

  //   // Dòng phân cách câu hỏi
  //   doc.moveDown(0.5);
  //   this.addQuestionSeparator(doc);
  // }

  // private addSeparator(doc: PDFKit.PDFDocument): void {
  //   doc.moveTo(50, doc.y)
  //     .lineTo(doc.page.width - 50, doc.y)
  //     .strokeColor('#bdc3c7')
  //     .lineWidth(0.5)
  //     .stroke();
  // }

  // private addQuestionSeparator(doc: PDFKit.PDFDocument): void {
  //   doc.moveTo(50, doc.y)
  //     .lineTo(doc.page.width - 50, doc.y)
  //     .strokeColor('#ecf0f1')
  //     .lineWidth(0.25)
  //     .stroke();
  // }

}

