import api from "./axios";

interface ISubjectFilter {
  page?: number;
  limit?: number;
  name?: string;
  status?: number;
}

export const getSubjects = async (params: ISubjectFilter) => {
  const res = await api.get("/subject", { params });
  return res.data;
};

export const createSubject = (data: any) => {
  return api.post("/subject", data);
};

export const getSubjectDetail = (id: string) => {
  return api.get(`/subject/${id}`);
};

export const updateSubject = (id: string, data: any) => {
  return api.put(`/subject/${id}`, data);
};

export const deleteSubject = (id: string) => {
  return api.delete(`/subject/${id}`);
};