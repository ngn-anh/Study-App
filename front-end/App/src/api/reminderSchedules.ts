export const a='2';
// src/api/reminderSchedules.ts
import { API_URL } from "@env";
import axios from "axios";

export interface ReminderSchedule {
  _id: string;
  user_id: string;
  title: string;
  note: string;
  due_date: string;
  due_time: string;
  remind_date: string;
  remind_time: string;
  repeat_mode: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Lấy danh sách lịch hẹn theo user_id
export const getSchedules = async (user_id: string): Promise<ReminderSchedule[]> => {
  const response = await axios.get(`${API_URL}/reminder-schedules/user/${user_id}`);
  return response.data;
};

// Lấy chi tiết 1 lịch hẹn
export const getScheduleDetail = async (id: string): Promise<ReminderSchedule> => {
  const response = await axios.get(`${API_URL}/reminder-schedules/detail/${id}`);
  return response.data;
};


// Tạo mới lịch hẹn
export const createSchedule = async (data: Partial<ReminderSchedule>) => {
  const response = await axios.post(`${API_URL}/reminder-schedules`, data);
  return response.data;
};

// Cập nhật lịch hẹn
export const updateSchedule = async (id: string, data: Partial<ReminderSchedule>) => {
  const response = await axios.put(`${API_URL}/reminder-schedules/${id}`, data);
  return response.data;
};

// Xoá nhiều lịch hẹn
export const deleteManySchedules = (ids: string[]) => 
  axios.post(`${API_URL}/reminder-schedules/delete-many`, { ids });