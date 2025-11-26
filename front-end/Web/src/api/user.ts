// src/api/user.ts
import api from "./axios";

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/users", data);
  return res.data;
};
