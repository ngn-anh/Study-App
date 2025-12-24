import { useEffect, useState } from "react";
import { getUserPermissions } from "./permission";

/**
 * Hook để check permission của user
 * @param permissionCode - mã quyền cần check (vd: "user.create")
 * @returns true/false
 */
export const usePermission = (permissionCode: string | string[]): boolean => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const permissions = getUserPermissions();
    
    if (Array.isArray(permissionCode)) {
      // Nếu là mảng, check có ít nhất 1 quyền (OR logic)
      setHasAccess(permissionCode.some((code) => permissions.includes(code)));
    } else {
      // Nếu là string, check đúng quyền đó
      setHasAccess(permissions.includes(permissionCode));
    }
  }, [permissionCode]);

  return hasAccess;
};

/**
 * Hook để lấy tất cả permissions của user
 */
export const useUserPermissions = (): string[] => {
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    setPermissions(getUserPermissions());
  }, []);

  return permissions;
};
