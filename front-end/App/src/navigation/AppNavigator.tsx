import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/data";
import SplashScreen1 from "../screens/SplashScreen1";
import SplashScreen2 from "../screens/SplashScreen2";
import AuthScreen from "../screens/AuthScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import MainTabs from "./MainTabs";
import ScheduleScreen from "../screens/ScheduleScreen";
import ScheduleDetailScreen from "../screens/ScheduleDetailScreen";
import CreateUpdateScheduleScreen from "../screens/CreateUpdateScheduleScreen";
import ExamListScreen from "../screens/ExamListScreen";
import ExamInfoScreen from "../screens/ExamInfoScreen";
import ExamDoScreen from "../screens/ExamDoScreen";
import { ExamResultScreen } from "../screens/ExamResultScreen";
import { ExamRankScreen } from "../screens/ExamRankScreen";
import ExamDetailResultScreen from "../screens/ExamDetailResultScreen";
import PracticeExamScreen from "../screens/PracticeExamScreen";
import PracticeExamDetailScreen from "../screens/PracticeExamDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Các màn không có tab bar */}
      <Stack.Screen name="SplashScreen1" component={SplashScreen1} />
      <Stack.Screen name="SplashScreen2" component={SplashScreen2} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
      <Stack.Screen name="CreateUpdateSchedule" component={CreateUpdateScheduleScreen} />
      <Stack.Screen name="ExamListScreen" component={ExamListScreen} />
      <Stack.Screen name="ExamInfoScreen" component={ExamInfoScreen} />
      <Stack.Screen name="ExamDoScreen" component={ExamDoScreen} />
      <Stack.Screen name="ExamResultScreen" component={ExamResultScreen} />
      <Stack.Screen name="ExamRankScreen" component={ExamRankScreen} />
      <Stack.Screen name="ExamDetailResultScreen" component={ExamDetailResultScreen} />
      <Stack.Screen name="PracticeExamScreen" component={PracticeExamScreen} />
      <Stack.Screen name="PracticeExamDetailScreen" component={PracticeExamDetailScreen} />

      {/* Tab chính */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
