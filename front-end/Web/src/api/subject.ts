import api from "./axios";

interface ISubjectFilter {
  page?: number;
  limit?: number;
  name?: string;
  status?: number;
}

export const getSubjects = async (params: ISubjectFilter) => {
  const res = await api.get("/subjects", { params });
  return res.data;
};

export const createSubject = (data: any) => {
  return api.post("/subjects", data);
};

export const getSubjectDetail = (id: string) => {
  return api.get(`/subjects/${id}`);
};

export const updateSubject = (id: string, data: any) => {
  return api.put(`/subjects/${id}`, data);
};

export const deleteSubject = (id: string) => {
  return api.delete(`/subjects/${id}`);
};
