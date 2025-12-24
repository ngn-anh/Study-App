import { RolePermission } from "../schemas/role-permissions.schema";

export const ROLE_PERMISSIONS_SEED: Partial<RolePermission>[] = [
  /* ================= ADMIN ================= */
  // ADMIN có toàn quyền

  // USER
  { role_code: 'admin', permission_code: 'user.create' },
  { role_code: 'admin', permission_code: 'user.read' },
  { role_code: 'admin', permission_code: 'user.update' },
  { role_code: 'admin', permission_code: 'user.delete' },

  // SUBJECT
  { role_code: 'admin', permission_code: 'subject.create' },
  { role_code: 'admin', permission_code: 'subject.read' },
  { role_code: 'admin', permission_code: 'subject.update' },
  { role_code: 'admin', permission_code: 'subject.delete' },

  // CLASS
  { role_code: 'admin', permission_code: 'class.create' },
  { role_code: 'admin', permission_code: 'class.read' },
  { role_code: 'admin', permission_code: 'class.update' },
  { role_code: 'admin', permission_code: 'class.delete' },

  // PROGRAM
  { role_code: 'admin', permission_code: 'program.create' },
  { role_code: 'admin', permission_code: 'program.read' },
  { role_code: 'admin', permission_code: 'program.update' },
  { role_code: 'admin', permission_code: 'program.delete' },

  // ROLE
  { role_code: 'admin', permission_code: 'role.create' },
  { role_code: 'admin', permission_code: 'role.read' },
  { role_code: 'admin', permission_code: 'role.update' },
  { role_code: 'admin', permission_code: 'role.delete' },

  // PERMISSION
  { role_code: 'admin', permission_code: 'permission.create' },
  { role_code: 'admin', permission_code: 'permission.read' },
  { role_code: 'admin', permission_code: 'permission.update' },
  { role_code: 'admin', permission_code: 'permission.delete' },

  /* ================= STAFF ================= */
  // STAFF chỉ có quyền xem (READ)

  // USER
  { role_code: 'staff', permission_code: 'user.read' },

  // SUBJECT
  { role_code: 'staff', permission_code: 'subject.read' },

  // CLASS
  { role_code: 'staff', permission_code: 'class.read' },

  // PROGRAM
  { role_code: 'staff', permission_code: 'program.read' },

  // ROLE
  { role_code: 'staff', permission_code: 'role.read' },

  // PERMISSION
  { role_code: 'staff', permission_code: 'permission.read' },
];
