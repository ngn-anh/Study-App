export const a='1';
import axios from "axios";
import { API_URL } from "@env";

export interface ClassItem {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export const getClasses = async (): Promise<ClassItem[]> => {
  const response = await axios.get(`${API_URL}/classes`);
  return response.data;
};
