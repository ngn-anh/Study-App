import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { requestUserPermission,  registerNotificationEvents, createDefaultChannel, setupForegroundListener } from './src/firebase/notification';
import { navigationRef } from './src/navigation/RootNavigation';

const App = () => {

  useEffect(() => {
    createDefaultChannel();
    requestUserPermission();
    setupForegroundListener();
    registerNotificationEvents();
  }, []);

  return (
    <NavigationContainer  ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
