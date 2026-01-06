import api from "./axios";

interface IExamFilter {
  page?: number;
  limit?: number;
  name?: string;
  sort?: string;
  subjectCodes?: string[];
  type?: number;
}

interface ExamInfo {
  subjectClassId: string;
  name: string;
  description?: string;
  type: number;
  difficulty?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  image?: string;
}

export const getExams = async (params?: IExamFilter) => {
  const res = await api.get("/exams", { params });
  return res.data;
};

export const getExamDetail = async (examId: string) => {
  const res = await api.get(`/exams/${examId}/info`);
  return res;
};

export const createExam = async (data: ExamInfo) => {
  const res = await api.post("/exams/create", data);
  return res;
};

export const updateExam = async (id: string, data: ExamInfo) => {
  const res = await api.patch(`/exams/update/${id}`, data);
  return res;
};

// export const deleteExam = async (examId: string) => {
//   const res = await api.patch(`/exams/delete/${examId}`);
//   return res;
// };

export const deleteExam = async (examId: string) => {
  const res = await api.delete(`/exams/delete/${examId}`);
  return res;
};
