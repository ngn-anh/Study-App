export function canAccessRoute(route: any, role: any) {
    return route.roles.includes(role);
}