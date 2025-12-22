import { House, BookOpen, Users, User, Bell, Gear } from "phosphor-react";
import HomePage from "./pages/homepage";
import SubjectPage from "./pages/subject";
import ClassPage from "./pages/class";
import ProgramPage from "./pages/program";
import StudentPage from "./pages/student";
import StaffPage from "./pages/staff";
import RolePage from "./pages/role";

export const appRoutes = [
  {
    path: "/home",
    label: "Trang chủ",
    icon: House,           
    element: HomePage,
    breadcrumb: "Trang chủ",
    roles: ["admin", "user"],
  },
  {
    path: "/subject",
    label: "Quản lý môn học",
    icon: BookOpen,
    element: SubjectPage,
    breadcrumb: "Quản lý môn học",
    roles: ["admin"],
  },
  {
    path: "/class",
    label: "Quản lý lớp học",
    icon: Users,
    element: ClassPage,
    breadcrumb: "Quản lý lớp học",
    roles: ["admin", "user"],
  },
  {
    path: "/user",
    label: "Quản lý người dùng",
    icon: User,
    breadcrumb: "Quản lý người dùng",
    roles: ["admin"],
    children: [
      {
        path: "/user/student",
        label: "Danh sách học sinh",
        element: StudentPage,
        breadcrumb: "Danh sách học sinh",
      },
      {
        path: "/user/staff",
        label: "Danh sách nhân viên",
        element: StaffPage,
        breadcrumb: "Danh sách nhân viên",
      },
    ]
  },
  {
    path: "/config",
    label: "Cấu hình hệ thống",
    icon: Gear ,
    breadcrumb: "Cấu hình hệ thống",
    roles: ["admin", "user"],
    children: [
      {
        path: "/config/role",
        label: "Cấu hình vai trò",
        element: RolePage,
        breadcrumb: "Cấu hình vai trò",
      },
      {
        path: "/config/program",
        label: "Cấu hình chương trình học",
        element: ProgramPage,
        breadcrumb: "Cấu hình chương trình học",
      },
    ],
  },
];
