import api from "./axios";

export interface IStaffFilter {
  page?: number;
  limit?: number;
  name?: string;
  class?: string;
  status?: number;
}

/**
 * Danh sách nhân viên (role = 2)
 */
export const getStaff = async (params: IStaffFilter) => {
  const res = await api.get("/users", {
    params: {
      ...params,
      exclude_roles: ["student"],
    },
  });
  return res.data;
};

/**
 * Xoá nhân viên (soft delete)
 */
export const deleteStaff = (id: string) => {
  return api.delete(`/users/${id}`);
};