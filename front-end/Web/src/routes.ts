import { House, BookOpen, Users, User, Bell } from "phosphor-react";
import HomePage from "./pages/homepage";

export const appRoutes = [
  {
    path: "/home",
    label: "Trang chủ",
    icon: House,            // ⬅ không dùng <House />
    element: HomePage,
    breadcrumb: "Trang chủ",
    roles: ["admin", "user"],
  },
  {
    path: "/subject",
    label: "Quản lý môn học",
    icon: BookOpen,
    element: HomePage,
    breadcrumb: "Quản lý môn học",
    roles: ["admin"],
  },
  {
    path: "/class",
    label: "Quản lý lớp học",
    icon: Users,
    element: HomePage,
    breadcrumb: "Quản lý lớp học",
    roles: ["admin", "user"],
  },
  {
    path: "/user",
    label: "Quản lý người dùng",
    icon: User,
    element: HomePage,
    breadcrumb: "Quản lý người dùng",
    roles: ["admin"],
  },
  {
    path: "/noti",
    label: "Quản lý thông báo",
    icon: Bell,
    element: HomePage,
    breadcrumb: "Quản lý thông báo",
    roles: ["admin", "user"],
  },
];
