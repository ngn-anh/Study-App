// Permission utilities - Main exports

export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  getPermissionsByModule,
  hasModulePermissions,
} from "./permission";

export { usePermission, useUserPermissions } from "./usePermission";

export {
  canAccessRoute,
  filterAccessibleRoutes,
} from "./routePermission";

export {
  SAMPLE_PERMISSIONS,
  ADMIN_USER_SAMPLE,
  REGULAR_USER_SAMPLE,
  setMockUserData,
  clearMockUserData,
} from "./mockPermissions";
