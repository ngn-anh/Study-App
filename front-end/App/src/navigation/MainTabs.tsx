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
      initialRouteName="Home"
      tabBar={(props) => <CurvedTabBar {...props} />}
    >
      
      <Tab.Screen name="Service" component={ServicesScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
