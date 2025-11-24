import { api } from './api';

interface RegisterData {
  username: string;
  password: string;
  email: string;
  class_id?: string | null;
}

interface LoginData {
  username: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await api.post('/auth/register', data);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed',
    };
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.log(error)
    return {
      success: false,
      message: error.response?.data || 'Login failed',
    };
  }
};