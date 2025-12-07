import { Exam, Subject } from "./typeObj";

export type RootStackParamList = {
  SplashScreen1: undefined;
  SplashScreen2: undefined;
  AuthScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Home: undefined;
  Service: undefined;
  Profile: undefined;
  ScheduleScreen: undefined;
  ScheduleDetail: { id: string };
  CreateUpdateSchedule: { id?: string, name?: string, due_date?: string }; // id có thể không có khi tạo mới
  ExamListScreen: { showSuccessModal?: boolean } | undefined;
  ExamInfoScreen: { examId: string };
  ExamDoScreen: {
    examId: string;
    reverseQuestion?: boolean;
    reverseAnswer?: boolean;
    durationSetting?: number;
  };
  ExamResultScreen: { examId: string, userId: string };
  ExamRankScreen: { examId: string, userId: string };
  ExamDetailResultScreen: { examResultId: string }
  PracticeExamScreen: { subjectId?: string, subjectCode?: string, classCode?: string };
  PracticeExamDetailScreen: { examId?: string };
  PracticeExamSettingScreen: { examId?: string };
  NotificationScreen: undefined;
  NotificationListScreen: { type: string };
};
