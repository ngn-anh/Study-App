import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen1 from "../screens/SplashScreen1";
import SplashScreen2 from "../screens/SplashScreen2";
import MainTabs from "./MainTabs";
import AuthScreen from "../screens/AuthScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Các màn không cần tab bar */}
      <Stack.Screen name="SplashScreen1" component={SplashScreen1} />
      <Stack.Screen name="SplashScreen2" component={SplashScreen2} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
      
      {/* Tab chính */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
