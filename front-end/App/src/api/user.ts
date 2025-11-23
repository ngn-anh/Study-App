import axios from 'axios';
import { API_URL } from '@env';

export interface UpdateAvatarPayload {
  user_id: string;
  avatar: string; // URL hoặc base64 tuỳ backend
}

export interface UpdateProfilePayload {
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  class_id?: string;
}

// API cập nhật avatar
export const updateAvatar = async (payload: UpdateAvatarPayload) => {
  const response = await axios.post(`${API_URL}/users/update-avatar`, payload);
  return response.data;
};

// API cập nhật thông tin user
export const updateProfile = async (payload: UpdateProfilePayload) => {
    console.log(payload)
  const response = await axios.put(`${API_URL}/users/update-profile`, payload);
  return response.data;
};