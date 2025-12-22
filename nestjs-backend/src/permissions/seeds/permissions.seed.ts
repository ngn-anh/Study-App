import { Permission } from "../schemas/permissions.schema";

export const PERMISSIONS_SEED: Partial<Permission>[] = [
  /* ================= USER ================= */
  {
    code: 'user.create',
    name: 'Tạo người dùng',
    module: 'user',
    action: 'create',
  },
  {
    code: 'user.read',
    name: 'Xem người dùng',
    module: 'user',
    action: 'read',
  },
  {
    code: 'user.update',
    name: 'Cập nhật người dùng',
    module: 'user',
    action: 'update',
  },
  {
    code: 'user.delete',
    name: 'Xoá người dùng',
    module: 'user',
    action: 'delete',
  },

  /* ================= SUBJECT ================= */
  {
    code: 'subject.create',
    name: 'Tạo môn học',
    module: 'subject',
    action: 'create',
  },
  {
    code: 'subject.read',
    name: 'Xem môn học',
    module: 'subject',
    action: 'read',
  },
  {
    code: 'subject.update',
    name: 'Cập nhật môn học',
    module: 'subject',
    action: 'update',
  },
  {
    code: 'subject.delete',
    name: 'Xoá môn học',
    module: 'subject',
    action: 'delete',
  },

  /* ================= CLASS ================= */
  {
    code: 'class.create',
    name: 'Tạo lớp học',
    module: 'class',
    action: 'create',
  },
  {
    code: 'class.read',
    name: 'Xem lớp học',
    module: 'class',
    action: 'read',
  },
  {
    code: 'class.update',
    name: 'Cập nhật lớp học',
    module: 'class',
    action: 'update',
  },
  {
    code: 'class.delete',
    name: 'Xoá lớp học',
    module: 'class',
    action: 'delete',
  },

  /* ================= PROGRAM ================= */
  {
    code: 'program.create',
    name: 'Tạo chương trình học',
    module: 'program',
    action: 'create',
  },
  {
    code: 'program.read',
    name: 'Xem chương trình học',
    module: 'program',
    action: 'read',
  },
  {
    code: 'program.update',
    name: 'Cập nhật chương trình học',
    module: 'program',
    action: 'update',
  },
  {
    code: 'program.delete',
    name: 'Xoá chương trình học',
    module: 'program',
    action: 'delete',
  },
];
