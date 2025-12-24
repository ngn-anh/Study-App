import React from "react";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "../../utils/permission";

interface PermissionGuardProps {
  // Quyền yêu cầu
  requiredPermissions?: string | string[];
  // Nếu true, check tất cả permissions; nếu false, check ít nhất 1 permission
  requireAll?: boolean;
  // Children component sẽ được render nếu user có quyền
  children: React.ReactNode;
  // Component/Element sẽ render nếu user không có quyền (mặc định: null)
  fallback?: React.ReactNode;
}

/**
 * Component để check quyền trước khi render
 * Sử dụng để ẩn/hiện buttons, menu items, etc.
 * 
 * Ví dụ:
 * <PermissionGuard requiredPermissions="user.create">
 *   <Button>Tạo người dùng</Button>
 * </PermissionGuard>
 * 
 * <PermissionGuard requiredPermissions={["role.read", "role.update"]} requireAll>
 *   <Button>Chỉnh sửa vai trò</Button>
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermissions,
  requireAll = false,
  children,
  fallback = null,
}) => {
  // Nếu không yêu cầu quyền, render children
  if (!requiredPermissions) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (typeof requiredPermissions === "string") {
    // Nếu là string, check quyền đó
    hasAccess = hasPermission(requiredPermissions);
  } else if (Array.isArray(requiredPermissions)) {
    // Nếu là mảng
    if (requireAll) {
      // Check tất cả quyền
      hasAccess = hasAllPermissions(requiredPermissions);
    } else {
      // Check ít nhất 1 quyền
      hasAccess = hasAnyPermission(requiredPermissions);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
