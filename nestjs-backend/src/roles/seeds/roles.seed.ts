import { Role } from "../schemas/role.schema";

export const ROLES_SEED: Partial<Role>[] = [
  {
    code: 'admin',
    name: 'Quản trị viên',
    description: 'Toàn quyền hệ thống',
  },
  {
    code: 'staff',
    name: 'Nhân viên',
    description: 'Nhân viên quản lý và vận hành',
  },
  {
    code: 'student',
    name: 'Học sinh',
    description: 'Người học trong hệ thống',
  },
];
