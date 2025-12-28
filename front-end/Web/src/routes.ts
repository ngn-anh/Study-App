import { House, BookOpen, Users, User, Gear } from "phosphor-react";
import HomePage from "./pages/homepage";
import SubjectPage from "./pages/subject";
import ClassPage from "./pages/class";
import ProgramPage from "./pages/program";
import StudentPage from "./pages/student";
import StaffPage from "./pages/staff";
import RolePage from "./pages/role";
import ExamPage from "./pages/Exam";
import QuestionPage from "./pages/Question";
import ExamLayout from "./component/ExamLayout";

export const appRoutes = [
  {
    path: "/home",
    label: "Trang chủ",
    icon: House,
    element: HomePage,
    breadcrumb: "Trang chủ",
    // Không cần permission hoặc để mặc định ai cũng vào được
    requiredPermissions: [],
  },
  {
    path: "/subject",
    label: "Quản lý môn học",
    icon: BookOpen,
    element: SubjectPage,
    breadcrumb: "Quản lý môn học",
    requiredPermissions: ["subject.read"],
  },
  {
    path: "/class",
    label: "Quản lý lớp học",
    icon: Users,
    element: ClassPage,
    breadcrumb: "Quản lý lớp học",
    requiredPermissions: ["class.read"],
  },
  {
    path: "/exam",
    label: "Quản lý đề thi",
    icon: BookOpen,
    element: ExamPage,
    breadcrumb: "Quản lý đề thi",
    requiredPermissions: ["exam.read"],
  },
  // {
  //   path: "/exam",
  //   label: "Quản lý đề thi",
  //   icon: BookOpen,
  //   element: ExamLayout, // 👈 layout
  //   breadcrumb: "Quản lý đề thi",
  //   requiredPermissions: ["exam.read"],
  //   children: [
  //     {
  //       index: true, // /exam
  //       element: ExamPage,
  //     },
  //     {
  //       path: ":examId/question",
  //       element: QuestionPage,
  //       requiredPermissions: ["question.read"],
  //     },
  //   ],
  // },
  {
    path: "/user",
    label: "Quản lý người dùng",
    icon: User,
    breadcrumb: "Quản lý người dùng",
    requiredPermissions: ["user.read"],
    children: [
      {
        path: "/user/student",
        label: "Danh sách học sinh",
        element: StudentPage,
        breadcrumb: "Danh sách học sinh",
        requiredPermissions: ["user.read"],
      },
      {
        path: "/user/staff",
        label: "Danh sách nhân viên",
        element: StaffPage,
        breadcrumb: "Danh sách nhân viên",
        requiredPermissions: ["user.read"],
      },
    ],
  },
  {
    path: "/config",
    label: "Cấu hình hệ thống",
    icon: Gear,
    breadcrumb: "Cấu hình hệ thống",
    requiredPermissions: ["role.read", "permission.read"],
    children: [
      {
        path: "/config/role",
        label: "Cấu hình vai trò",
        element: RolePage,
        breadcrumb: "Cấu hình vai trò",
        requiredPermissions: ["role.read"],
      },
      {
        path: "/config/program",
        label: "Cấu hình chương trình học",
        element: ProgramPage,
        breadcrumb: "Cấu hình chương trình học",
        requiredPermissions: ["program.read"],
      },
    ],
  },
];
