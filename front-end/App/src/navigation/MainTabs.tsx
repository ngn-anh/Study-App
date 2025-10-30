import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CurvedTabBar from "../components/CurvedTabBar";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CurvedTabBar {...props} />}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Dịch vụ" component={ServicesScreen} />
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
