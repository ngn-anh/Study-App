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