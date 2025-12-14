import { Exam, Subject } from './typeObj';

export type MainTabsParamList = {
  Home: { showNotificationPopup?: boolean } | undefined;
  Service: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  SplashScreen1: undefined;
  SplashScreen2: undefined;
  AuthScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs:
    | {
        screen: keyof MainTabsParamList;
        params?: any;
      }
    | undefined;
  Home: { showNotificationPopup?: boolean } | undefined;
  Service: undefined;
  Profile: undefined;
  ScheduleScreen: undefined;
  ScheduleDetail: { id: string };
  CreateUpdateSchedule: { id?: string; name?: string; due_date?: string }; // id có thể không có khi tạo mới
  ExamListScreen: { showSuccessModal?: boolean } | undefined;
  ExamInfoScreen: { examId: string };
  // ExamDoScreen: { examId: string };
  ExamDoScreen: {
    examId: string;
    reverseQuestion?: boolean;
    reverseAnswer?: boolean;
    durationSetting?: number | null;
  };
  ExamResultScreen: { examId: string; userId: string };
  ExamRankScreen: { examId: string; userId: string };
  ExamDetailResultScreen: { examResultId: string };
  PracticeExamScreen: {
    subjectId?: string;
    subjectCode?: string;
    classCode?: string;
    classId?: string;
  };
  PracticeExamDetailScreen: {
    examId?: string;
    // subjectCode?: string;
    submitted?: number;
  };
  PracticeExamSettingScreen: { examId?: string };
  NotificationScreen: undefined;
  NotificationListScreen: { type: string };
};
