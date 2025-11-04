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

export const getExams = async (params: {
  status?: 'ongoing' | 'upcoming';
  sort?: 'newest' | 'oldest';
  subjectCodes?: string[];
  name?: string;
  currentClassCode?: string;
  page?: number;
  limit?: number;
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
  return response.data;
};

