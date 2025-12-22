export const canAccessRoute = (
  route: any,
  userRole?: string,
) => {
  // Không khai báo roles → ai cũng vào được
  if (!route.roles || route.roles.length === 0) return true;

  if (!userRole) return false;

  return route.roles.includes(userRole);
};