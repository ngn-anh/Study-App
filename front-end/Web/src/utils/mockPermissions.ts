/**
 * Sample permissions cho development/testing
 * Dùng để mock dữ liệu khi chưa có BE hoàn chỉnh
 */

export const SAMPLE_PERMISSIONS = {
  // User module
  "user.create": "Tạo người dùng",
  "user.read": "Xem người dùng",
  "user.update": "Chỉnh sửa người dùng",
  "user.delete": "Xoá người dùng",

  // Role module
  "role.create": "Tạo vai trò",
  "role.read": "Xem vai trò",
  "role.update": "Chỉnh sửa vai trò",
  "role.delete": "Xoá vai trò",

  // Permission module
  "permission.create": "Tạo quyền",
  "permission.read": "Xem quyền",
  "permission.update": "Chỉnh sửa quyền",
  "permission.delete": "Xoá quyền",

  // Subject module
  "subject.create": "Tạo môn học",
  "subject.read": "Xem môn học",
  "subject.update": "Chỉnh sửa môn học",
  "subject.delete": "Xoá môn học",

  // Class module
  "class.create": "Tạo lớp học",
  "class.read": "Xem lớp học",
  "class.update": "Chỉnh sửa lớp học",
  "class.delete": "Xoá lớp học",

  // Program module
  "program.create": "Tạo chương trình học",
  "program.read": "Xem chương trình học",
  "program.update": "Chỉnh sửa chương trình học",
  "program.delete": "Xoá chương trình học",
};

/**
 * Sample user data với tất cả quyền (dùng để test admin)
 */
export const ADMIN_USER_SAMPLE = {
  user: {
    id: "admin-001",
    username: "admin",
    full_name: "Admin",
    email: "admin@example.com",
    role: "admin",
    permissions: Object.keys(SAMPLE_PERMISSIONS),
  },
};

/**
 * Sample user data với quyền hạn chế (dùng để test user bình thường)
 */
export const REGULAR_USER_SAMPLE = {
  user: {
    id: "user-001",
    username: "teacher",
    full_name: "Giáo viên",
    email: "teacher@example.com",
    role: "teacher",
    permissions: [
      "user.read",
      "class.read",
      "subject.read",
      "program.read",
    ],
  },
};

/**
 * Hàm set mock user data vào localStorage (cho development)
 * @param userType - 'admin' | 'user'
 */
export const setMockUserData = (userType: "admin" | "user" = "admin") => {
  const userData =
    userType === "admin" ? ADMIN_USER_SAMPLE : REGULAR_USER_SAMPLE;
  localStorage.setItem("userData", JSON.stringify(userData));
  console.log(`Mock user data set: ${userType}`, userData);
};

/**
 * Clear mock user data
 */
export const clearMockUserData = () => {
  localStorage.removeItem("userData");
  console.log("Mock user data cleared");
};
