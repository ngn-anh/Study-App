export const a='2';
import { api } from "./api";

export const getSubjectByClass = async (classId: string) => {
    const response = await api.get(`/subjects/by-class`, {
        params: { class_id: classId }
    });
    return response.data;
};