import api from "./axios";

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  phone?: string;
  avatar?: string;
  full_name?: string;
  class_id?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// ĐĂNG KÝ
export const register = async (data: RegisterData ) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// ĐĂNG NHẬP
export const login = async (data: LoginData) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
