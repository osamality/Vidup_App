/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

AppRegistry.registerComponent(appName, () => App);
