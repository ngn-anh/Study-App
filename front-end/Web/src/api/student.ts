import api from "./axios";

export interface IStudentFilter {
  page?: number;
  limit?: number;
  name?: string;
  class?: string;
  status?: number;
}

/**
 * Danh sách học sinh (role = 1)
 */
export const getStudents = async (params: IStudentFilter) => {
  const res = await api.get("/users", {
    params: {
      ...params,
      roles: ["student"], // role học sinh
    },
  });
  return res.data;
};

/**
 * Xoá học sinh (soft delete)
 */
export const deleteStudent = (id: string) => {
  return api.delete(`/users/${id}`);
};