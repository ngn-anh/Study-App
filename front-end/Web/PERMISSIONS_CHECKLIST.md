# Danh sách Permissions cần thiết cho các Page

## 📋 Pages & Permissions

### 1. **Quản lý Môn học** (`/subject`)
- `subject.create` - Nút "Môn Học Mới"
- `subject.update` - Nút "Sửa"
- `subject.delete` - Nút "Xoá"

### 2. **Quản lý Lớp học** (`/class`)
- `class.create` - Nút "Lớp Học Mới"
- `class.update` - Nút "Sửa"
- `class.delete` - Nút "Xoá"

### 3. **Danh sách Học sinh** (`/user/student`)
- `user.delete` - Nút "Xoá học sinh"

### 4. **Danh sách Nhân viên** (`/user/staff`)
- `user.update` - Nút "Cấu hình vai trò"
- `user.delete` - Nút "Xoá nhân viên"

### 5. **Cấu hình Vai trò** (`/config/role`)
- `role.create` - Nút "Vai Trò Mới"
- `role.update` - Nút "Sửa"
- `role.delete` - Nút "Xoá"
- `role.read` - Đọc danh sách vai trò (yêu cầu route)

### 6. **Cấu hình Chương trình học** (`/config/program`)
- `program.create` - Nút "Tạo mới"
- `program.update` - Nút "Sửa"
- `program.delete` - Nút "Xoá"
- `program.read` - Đọc danh sách (yêu cầu route)

---

## 🔧 Cách tạo Permissions trong BE

Bạn cần seed dữ liệu permissions vào DB:

```typescript
// seeds/permissions.seed.ts
const permissionsToCreate = [
  // Subject
  { code: 'subject.create', name: 'Tạo môn học', module: 'subject', action: 'create' },
  { code: 'subject.read', name: 'Xem môn học', module: 'subject', action: 'read' },
  { code: 'subject.update', name: 'Chỉnh sửa môn học', module: 'subject', action: 'update' },
  { code: 'subject.delete', name: 'Xoá môn học', module: 'subject', action: 'delete' },

  // Class
  { code: 'class.create', name: 'Tạo lớp học', module: 'class', action: 'create' },
  { code: 'class.read', name: 'Xem lớp học', module: 'class', action: 'read' },
  { code: 'class.update', name: 'Chỉnh sửa lớp học', module: 'class', action: 'update' },
  { code: 'class.delete', name: 'Xoá lớp học', module: 'class', action: 'delete' },

  // User
  { code: 'user.create', name: 'Tạo người dùng', module: 'user', action: 'create' },
  { code: 'user.read', name: 'Xem người dùng', module: 'user', action: 'read' },
  { code: 'user.update', name: 'Chỉnh sửa người dùng', module: 'user', action: 'update' },
  { code: 'user.delete', name: 'Xoá người dùng', module: 'user', action: 'delete' },

  // Role
  { code: 'role.create', name: 'Tạo vai trò', module: 'role', action: 'create' },
  { code: 'role.read', name: 'Xem vai trò', module: 'role', action: 'read' },
  { code: 'role.update', name: 'Chỉnh sửa vai trò', module: 'role', action: 'update' },
  { code: 'role.delete', name: 'Xoá vai trò', module: 'role', action: 'delete' },

  // Program
  { code: 'program.create', name: 'Tạo chương trình học', module: 'program', action: 'create' },
  { code: 'program.read', name: 'Xem chương trình học', module: 'program', action: 'read' },
  { code: 'program.update', name: 'Chỉnh sửa chương trình học', module: 'program', action: 'update' },
  { code: 'program.delete', name: 'Xoá chương trình học', module: 'program', action: 'delete' },

  // Permission
  { code: 'permission.create', name: 'Tạo quyền', module: 'permission', action: 'create' },
  { code: 'permission.read', name: 'Xem quyền', module: 'permission', action: 'read' },
  { code: 'permission.update', name: 'Chỉnh sửa quyền', module: 'permission', action: 'update' },
  { code: 'permission.delete', name: 'Xoá quyền', module: 'permission', action: 'delete' },
];
```

---

## 🎯 Cách gán Permissions cho Roles

### Admin Role
Gán **tất cả** permissions

### Teacher Role
```
subject.read
class.read
user.read
program.read
```

### Student Role
```
program.read
```

---

## 📝 Checklist

- [ ] Tạo tất cả permissions trong seeds
- [ ] Gán permissions cho các roles (admin, teacher, student, ...)
- [ ] Khi user login, BE trả về `user.permissions: string[]`
- [ ] FE check permission trước khi hiển thị buttons
- [ ] Test các scenarios khác nhau với các roles khác nhau
- [ ] Đảm bảo BE cũng validate permissions (server-side check)

---

## 🔐 Lưu ý Bảo mật

⚠️ **QUAN TRỌNG**: Chỉ check permissions trên FE là không đủ!
- User có thể chỉnh sửa localStorage để bypass FE check
- **PHẢI** validate permissions trên BE khi:
  - Tạo/sửa/xoá bất kỳ dữ liệu nào
  - Gọi bất kỳ API nào

Bạn cần implement **permission middleware** hoặc **guards** trong BE!
