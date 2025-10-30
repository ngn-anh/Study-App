import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen1 from "../screens/SplashScreen1";
import SplashScreen2 from "../screens/SplashScreen2";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Các màn không cần tab bar */}
      <Stack.Screen name="SplashScreen1" component={SplashScreen1} />
      <Stack.Screen name="SplashScreen2" component={SplashScreen2} />
      
      {/* Tab chính */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
