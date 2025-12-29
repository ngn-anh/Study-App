import { api } from './api';

export const toggleExamLike = async (params: {
  user_id: string;
  exam_id: string;
  is_liked: number;
}) => {
  const response = await api.post(`/exams/like`, params);
  return response.data;
};
