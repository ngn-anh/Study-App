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
  CreateUpdateSchedule: { id?: string }; // id có thể không có khi tạo mới
  PracticeExam: undefined;
};
