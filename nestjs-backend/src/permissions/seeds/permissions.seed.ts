import { Permission } from '../schemas/permissions.schema';

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

  /* ================= ROLE ================= */
  {
    code: 'role.create',
    name: 'Tạo vai trò',
    module: 'role',
    action: 'create',
  },
  {
    code: 'role.read',
    name: 'Xem vai trò',
    module: 'role',
    action: 'read',
  },
  {
    code: 'role.update',
    name: 'Cập nhật vai trò',
    module: 'role',
    action: 'update',
  },
  {
    code: 'role.delete',
    name: 'Xoá vai trò',
    module: 'role',
    action: 'delete',
  },

  /* ================= PERMISSION ================= */
  {
    code: 'permission.create',
    name: 'Tạo quyền',
    module: 'permission',
    action: 'create',
  },
  {
    code: 'permission.read',
    name: 'Xem quyền',
    module: 'permission',
    action: 'read',
  },
  {
    code: 'permission.update',
    name: 'Cập nhật quyền',
    module: 'permission',
    action: 'update',
  },
  {
    code: 'permission.delete',
    name: 'Xoá quyền',
    module: 'permission',
    action: 'delete',
  },

  /* ================= EXAM ================= */
  {
    code: 'exam.create',
    name: 'Tạo bài thi',
    module: 'exam',
    action: 'create',
  },
  {
    code: 'exam.read',
    name: 'Xem bài thi',
    module: 'exam',
    action: 'read',
  },
  {
    code: 'exam.update',
    name: 'Cập nhật bài thi',
    module: 'exam',
    action: 'update',
  },
  {
    code: 'exam.delete',
    name: 'Xoá bài thi',
    module: 'exam',
    action: 'delete',
  },

  /* ================= QUESTION ================= */
  {
    code: 'question.create',
    name: 'Tạo câu hỏi',
    module: 'question',
    action: 'create',
  },
  {
    code: 'question.read',
    name: 'Xem câu hỏi',
    module: 'question',
    action: 'read',
  },
  {
    code: 'question.update',
    name: 'Cập nhật câu hỏi',
    module: 'question',
    action: 'update',
  },
  {
    code: 'question.delete',
    name: 'Xoá câu hỏi',
    module: 'question',
    action: 'delete',
  },
];
