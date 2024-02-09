import Router from './_navigations';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <MenuProvider>
      <Router />
    </MenuProvider>
  );
};

export default App;
