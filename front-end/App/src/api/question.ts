export const a='2';
import { api } from "./api";

export const getQuestionsByExam = async (
    examId: string,
    reverseQuestion?: boolean,
    reverseAnswer?: boolean,
) => {
    const response = await api.get(`/questions/by-exam`, {
        params: {
            exam_id: examId,
            ...(reverseQuestion !== undefined && { reverseQuestion }),
            ...(reverseAnswer !== undefined && { reverseAnswer }),
        }
    });
    return response.data;
};