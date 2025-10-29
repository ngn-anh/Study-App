import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import CurvedTabBar from '../components/CurvedTabBar';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Trang chủ"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CurvedTabBar {...props} />}
    >
      <Tab.Screen name="Dịch vụ" component={ServicesScreen} />
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
