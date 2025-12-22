import api from "./axios";

interface IClassFilter {
  page?: number;
  limit?: number;
  name?: string;
  status?: number;
}

export const getClasses = async (params: IClassFilter) => {
  const res = await api.get("/classes", { params });
  return res.data;
};

export const createClass = (data: any) => {
  return api.post("/classes", data);
};

export const getClassDetail = (id: string) => {
  return api.get(`/classes/${id}`);
};

export const updateClass = (id: string, data: any) => {
  return api.patch(`/classes/${id}`, data);
};

export const deleteClass = (id: string) => {
  return api.delete(`/classes/${id}`);
};

export const getPrograms = async (params: any) => {
  const res = await api.get("/classes/program", { params });
  return res.data;
};

export const getDetailProgram = async (id: string) => {
  const res = await api.get(`/classes/program/${id}`);
  return res;
};

export const createProgram = (class_id: string, subject_ids: string[]) => {
  return api.post("/classes/program", { class_id, subject_ids });
};