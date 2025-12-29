import axios from 'axios';
import { API_URL } from '@env';
import { api } from './api';

export interface ClassItem {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export const getClasses = async (): Promise<ClassItem[]> => {
  const response = await axios.get(`${API_URL}/classes`, {
    // Grab a reasonable page size so the picker has data without pagination.
    params: { page: 1, limit: 100 },
  });

  const payload = response.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;

  // Fallback to empty array to avoid runtime crash when API shape changes.
  return [];
};

export const getClassById = async (id: string) => {
  const response = await api.get(`/classes/${id}`);
  return response.data;
};
