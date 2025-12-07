import axios from "axios";
import { API_URL } from "@env";
import { api } from "./api";

// export interface ExamResultDetail {
//   examResultId: string;
//   total_correct: number;
//   total_question: number;
//   total_wrong: number;
//   total_not_done: number;
//   durationSec: number; // ISO string hoặc "15p00s"
//   duration_text: string; // ISO string hoặc "15p00s"
// }

export interface Answer {
  _id: string;
  description: string;
  is_correct: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  options: string[];
  correctAnswer?: number;
  answers: Answer[];
  userAnswer?: number;
}

export interface ExamDetailResult {
  questions: Question[];
}

// export const getExamResultDetail = async (user_id: string, exam_id: string) => {
//   const res = await axios.get(`${API_URL}/exam-result/detail`, {
//     params: { user_id, exam_id },
//   });
//   return res.data;
// };

export const getExamResultDetail = async (user_id: string, exam_id: string) => {
  const res = await api.get(`/exam-result/detail`, {
    params: { user_id, exam_id },
  });
  return res.data;
};

export const getExamDetailResult = async (
  examResultId: string
): Promise<ExamDetailResult> => {
  const res = await axios.get(`${API_URL}/exam-result/${examResultId}`);
  return res.data;
};