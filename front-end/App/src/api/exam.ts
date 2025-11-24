// src/api/exam.ts
import { API_URL } from "@env";
import axios from "axios";

export interface ExamsFilter {
  status?: "ongoing" | "upcoming"; // ExamStatus
  name?: string;                   // tìm kiếm theo tên
  sort?: "newest" | "oldest";      // SortOrder
  currentClassCode?: string;       // mã lớp
  subjectCodes?: string[];         // danh sách môn học
  type?: number;                   // 1 hoặc 2
  page?: number;
  limit?: number;
}

export interface SubmitExamPayload {
  exam_id: string;
  user_id: string;
  answers: {
    answer_question_id: string | null;
    is_correct: boolean;
  }[];
  time_start?: string;
  time_end?: string;
}

export interface ExamInfoResponse {
  _id: string;
  name: string;
  image?: string;
  duration: number;
  participants: number;
}

export const getExams = async (params: {
  status?: 'ongoing' | 'upcoming';
  sort?: 'newest' | 'oldest';
  subjectCodes?: string[];
  name?: string;
  class_id?: string;
  page?: number;
  limit?: number;
  userId?: string;
}) => {
  const response = await axios.get(`${API_URL}/exams`, {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      });
      return searchParams.toString();
    },
  });
  console.log('response',response)
  return response.data;
};

export const getExamQuestions = async (examId: string) => {
  const response = await axios.get(`${API_URL}/questions/by-exam`, {
    params: { exam_id: examId },
  });
  return response.data.data; //  { success, total, data }
};

export const submitExam = async (payload: SubmitExamPayload) => {
  const res = await axios.post(`${API_URL}/exams/submit`, payload);
  return res.data;
};

export const getExamInfo = async (examId: string): Promise<ExamInfoResponse> => {
  const res = await axios.get(`${API_URL}/exams/${examId}/info`);
  return res.data;
};

export const getExamRank = async (params: { examId: string; userId: string; searchName?: string }) => {
  console.log(params);
  const { data } = await axios.get(`${API_URL}/exams/rank`, { params });
  return data;
};