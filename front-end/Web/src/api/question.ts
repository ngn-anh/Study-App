import api from "./axios";

export const getQuestionsByExam = async (examId: string) => {
  const res = await api.get("/questions/by-exam", {
    params: {
      exam_id: examId,
    },
  });
  return res.data;
};

export const getQuestionById = async (examId: string) => {
  const res = await api.get(`/questions/${examId}`);
  return res.data;
};

export const createQuestion = async (payload: {
  exam_id?: string;
  description?: string;
  // image?: string;
  difficulty?: number;
  section?: string;
  answers?: Array<{
    description?: string;
    is_correct?: boolean;
    explanation?: string;
  }>;
}) => {
  const res = await api.post("/questions/create", payload);
  return res.data;
};

export const createManyQuestion = async (payload: {
  exam_id: string;
  questions?: {
    description?: string;
    difficulty?: number;
    section?: number | string;
    answers?: {
      description?: string;
      is_correct?: boolean;
      explanation?: string;
    }[];
  }[];
}) => {
  const res = await api.post("/questions/create-many", payload);
  return res.data;
};

export const updateQuestion = async (id: string, body: any) => {
  const res = await api.patch(`/questions/update/${id}`, body);
  return res.data;
};

export const softDeleteQuestion = async (id: string) => {
  const res = await api.patch(`/questions/delete/${id}`);
  return res.data;
};
