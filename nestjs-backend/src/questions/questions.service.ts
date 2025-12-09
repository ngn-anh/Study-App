import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/questions.schema';
import {
  AnswerQuestion,
  AnswerQuestionDocument,
} from 'src/answer-questions/schemas/answer-questions.schema';
import { Exam, ExamDocument } from 'src/exams/schemas/exams.schema';
import { shuffleArray } from 'src/utils';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(AnswerQuestion.name)
    private answerModel: Model<AnswerQuestionDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async findByExamId(
    examId: string,
    options?: {
      reverseQuestion?: boolean;
      reverseAnswer?: boolean;
    },
  ) {
    const { reverseQuestion = false, reverseAnswer = false } = options || {};

    // Lấy thông tin exam
    const exam = await this.examModel
      .findById(examId)
      .select('_id name duration')
      .lean();

    if (!exam) {
      return null;
    }

    // Lấy câu hỏi
    const questions = await this.questionModel
      .find({ exam_id: new Types.ObjectId(examId), deleted_at: null })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    const questionIds = questions.map((q) => q._id);

    // Lấy đáp án
    const answers = await this.answerModel
      .find({ question_id: { $in: questionIds }, deleted_at: null })
      .select('-created_at -updated_at -deleted_at')
      .lean();

    // Gộp question + answers
    // const questionsWithAnswers = questions.map(q => ({
    //   ...q,
    //   answers: answers.filter(a => a.question_id.toString() === q._id.toString()),
    // }));
    let questionsWithAnswers = questions.map((q) => {
      let questionAnswers = answers.filter(
        (a) => a.question_id.toString() === q._id.toString(),
      );

      // Đảo thứ tự câu trả lời nếu reverseAnswer = true
      if (reverseAnswer) {
        questionAnswers = shuffleArray([...questionAnswers]);
      }

      return {
        ...q,
        answers: questionAnswers,
      };
    });

    // Đảo thứ tự câu hỏi nếu reverseQuestion = true
    if (reverseQuestion) {
      questionsWithAnswers = shuffleArray(questionsWithAnswers);
    }

    // Trả về exam + questions
    return {
      exam,
      questions: questionsWithAnswers,
    };
  }
}
