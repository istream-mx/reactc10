/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import {changeDataNotification} from './src/utils/notifications';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
