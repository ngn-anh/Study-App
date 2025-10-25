import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {HomeScreen} from './screens/HomeScreen';
// import {ServicesScreen} from './screens/ServicesScreen';
// import {ProfileScreen} from './screens/ProfileScreen';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066FF',
        tabBarStyle: { height: 60, paddingBottom: 5 },
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Icon name="home" color={color} size={size} />
        //   ),
        // }}
      />
      <Tab.Screen
        name="Dịch vụ"
        component={ServicesScreen}
        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Icon name="apps" color={color} size={size} />
        //   ),
        // }}
      />
      <Tab.Screen
        name="Hồ sơ"
        component={ProfileScreen}
        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Icon name="person" color={color} size={size} />
        //   ),
        // }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
