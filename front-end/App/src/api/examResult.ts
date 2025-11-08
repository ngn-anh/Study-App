import axios from "axios";
import { API_URL } from "@env";

export interface ExamResultDetail {
  examResultId: string;
  total_correct: number;
  total_question: number;
  total_wrong: number;
  total_not_done: number;
  durationSec: number; // ISO string hoặc "15p00s"
  duration_text: string; // ISO string hoặc "15p00s"
}

export const getExamResultDetail = async (user_id: string, exam_id: string) => {
  const res = await axios.get(`${API_URL}/exam-result/detail`, {
    params: { user_id, exam_id },
  });
  return res.data; // dữ liệu backend trả về
};
