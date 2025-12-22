import api from "./axios";

export const getRoles = async (params: any) => {
  const res = await api.get("/roles", { params });
  return res.data; 
};

export const deleteRole = (code: string) =>
  api.delete(`/roles/${code}`);

export const createRole = (data: any) =>
  api.post('/roles', data);

export const updateRole = (code: string, data: any) =>
  api.put(`/roles/${code}`, data);

export const getRoleDetail = (code: any) =>
  api.get(`/roles/${code}`);

export const getRoleOptions = async () => {
  const res = await api.get('/roles/options');
  return res.data;
};