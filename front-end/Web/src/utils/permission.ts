/**
 * Utility functions để check permission trên FE
 * Permission format: "module.action" (vd: "user.create", "role.delete")
 */

/**
 * Lấy danh sách permission của user từ localStorage
 */
export const getUserPermissions = (): string[] => {
  try {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return [];
    
    const userData = JSON.parse(userDataString);
    return userData?.user?.permissions || [];
  } catch (error) {
    console.error("Error parsing user permissions:", error);
    return [];
  }
};

/**
 * Check xem user có quyền cụ thể không
 * @param permissionCode - mã quyền (vd: "user.create")
 * @returns true nếu user có quyền, false nếu không
 */
export const hasPermission = (permissionCode: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permissionCode);
};

/**
 * Check xem user có tất cả các quyền không
 * @param permissionCodes - mảng mã quyền
 * @returns true nếu user có tất cả quyền, false nếu thiếu 1 quyền
 */
export const hasAllPermissions = (permissionCodes: string[]): boolean => {
  return permissionCodes.every((code) => hasPermission(code));
};

/**
 * Check xem user có ít nhất 1 trong các quyền không
 * @param permissionCodes - mảng mã quyền
 * @returns true nếu user có ít nhất 1 quyền, false nếu không có quyền nào
 */
export const hasAnyPermission = (permissionCodes: string[]): boolean => {
  return permissionCodes.some((code) => hasPermission(code));
};

/**
 * Lấy tất cả permissions được gom theo module
 */
export const getPermissionsByModule = (): Record<string, string[]> => {
  const permissions = getUserPermissions();
  const grouped: Record<string, string[]> = {};

  permissions.forEach((permission) => {
    const [module, action] = permission.split(".");
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push(action);
  });

  return grouped;
};

/**
 * Check xem user có các quyền của một module không
 * @param module - tên module (vd: "user")
 * @param actions - mảng action cần check (vd: ["create", "update"])
 * @returns true nếu user có tất cả action của module
 */
export const hasModulePermissions = (
  module: string,
  actions: string[]
): boolean => {
  return actions.every((action) => hasPermission(`${module}.${action}`));
};
