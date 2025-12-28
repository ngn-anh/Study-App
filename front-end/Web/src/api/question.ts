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
