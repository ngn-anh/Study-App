// api/permission.ts
import api from "./axios";

export const getRolePermissions = async (roleCode: string) => {
  const res = await api.get(`/roles/${roleCode}/permissions`);
  return res.data; 
};

export const updateRolePermissions = (
  roleCode: string,
  permissionCodes: any,
) => {
  return api.put(`/roles/${roleCode}/permissions`, {
    permissionCodes,
  });
};

