import React, { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import AuthNavigation from './AuthNavigation';
import DashboardNavigation from './DashboardNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkTheme, NavigationContainer, useTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from '../../store/utils/axiosCongif';
import NetInfo from '@react-native-community/netinfo';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { AppIntro } from 'screens';
import { useDarkMode } from 'react-native-dynamic';
import { Color, FontFamily } from 'constants';
//firebase
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
//Redux
import { connect } from 'react-redux';

const Stack = createStackNavigator();

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#fff',
    text: '#d0d0d0',
    card: '#1c1c1c',
    heading: '#b9b9b9',
    inputInnerColor: '#363638',
    inputBorder: '#2c2c2e',
    errorText: '#d0d0d0',
    grey: '#363638',
  },
};

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    background: '#fff',
    border: '#d0d0d0',
    heading: '#777777',
    text: '#464646',
    inputInnerColor: '#fff',
    inputBorder: Color.LightGrey1,
    errorText: '#d0d0d0',
    grey: '#F2F2F7',
  },
};

const AppNavigation = (props) => {
  const { user, appIntro, updateNotificationCount, notificationCount } = props;
  // App theme light or dark
  const isDarkMode = useDarkMode();
  const theme = isDarkMode ? 'dark' : 'light';
  const notificationUpdatedCount = useRef(notificationCount);
  const { colors } = useTheme();

  useEffect(() => {
    notificationUpdatedCount.current = notificationCount;
  }, [notificationCount]);

  useEffect(() => {
    if (user) {
      axios.init(user.token);
    }
  }, [user, appIntro]);

  const linking = {
    prefixes: ['https://reactnavigation.org/', 'vidupapp-scheme://'],
    config: {
      screens: {
        Auth: {
          screens: {
            LoginScreen: {
              path: 'Login/:id',
              params: {
                id: null,
              },
            },
          },
        },
      },
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking} theme={theme == 'light' ? lightTheme : darkTheme}>
        {
          appIntro == '0' ? (
            <Stack.Navigator>
              <Stack.Screen name="AppIntro" component={AppIntro} options={{ headerShown: false }} />
            </Stack.Navigator>
          ) : user.token ? (
            //  <DashboardNavigation></DashboardNavigation>
            <Stack.Navigator>
              <Stack.Screen
                name="Dashboard"
                component={DashboardNavigation}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          ) : (
            // <Stack.Screen name="Dashboard" component={DashboardNavigation} options={{ headerShown: false }} />
            // <AuthNavigation></AuthNavigation>
            <Stack.Navigator>
              <Stack.Screen
                name="Auth"
                component={AuthNavigation}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          )
          //
        }
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    appIntro: state.postsReducer.appIntro,
    notificationCount: state.user.totalNotifications,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateNotificationCount: (count) =>
      dispatch({
        type: 'Notification_Count',
        payload: count,
      }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
