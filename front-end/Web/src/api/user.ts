import api from "./axios";

// api/user.ts
export const getUserDetail = (id: string) =>
  api.get(`/users/${id}`);

export const updateProfile = (data: any) =>
  api.put(`/users/update-profile`, data);
