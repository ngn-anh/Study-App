import { hasAnyPermission } from "./permission";

/**
 * Check xem user có quyền truy cập route không
 * @param route - đối tượng route
 * @returns true nếu có quyền, false nếu không
 */
export const canAccessRoute = (route: any): boolean => {
  // Nếu route không yêu cầu permission, cho phép truy cập
  if (!route.requiredPermissions || route.requiredPermissions.length === 0) {
    return true;
  }

  // Check xem user có ít nhất 1 trong các quyền yêu cầu
  return hasAnyPermission(route.requiredPermissions);
};

/**
 * Filter routes dựa trên permission của user
 * @param routes - danh sách routes
 * @returns danh sách routes mà user có quyền
 */
export const filterAccessibleRoutes = (routes: any[]): any[] => {
  return routes
    .filter((route) => canAccessRoute(route))
    .map((route) => {
      // Nếu route có children, filter children theo permission
      if (route.children && route.children.length > 0) {
        return {
          ...route,
          children: route.children.filter((child: any) =>
            canAccessRoute(child)
          ),
        };
      }
      return route;
    })
    .filter((route) => !route.children || route.children.length > 0);
};
