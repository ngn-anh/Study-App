import api from "./axios";

interface IExamFilter {
  page?: number;
  limit?: number;
  name?: string;
  sort?: string;
  subjectCodes?: string[];
  type?: number;
}

export const getExams = async (params?: IExamFilter) => {
  const res = await api.get("/exams", { params });
  return res.data;
};

export const getExamDetail = async (examId: string) => {
  const res = await api.get(`/exams/${examId}/info`);
  return res.data;
};
