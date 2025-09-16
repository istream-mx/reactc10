/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {config} from './gluestack-ui.config';
import {Provider, useDispatch} from 'react-redux';
import {store, persistor} from './src/app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import MainStack from './src/navigation/MainStack';
import {useNotification} from './src/utils/notifications';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {registerTokenNotificationDevice} from './src/app/reducers/pushNotificationStore';
import {CONSUMER_KEY} from './src/environments';
import {createTokenNotification} from './src/services/NotificationApi';
import SplashScreen from 'react-native-splash-screen';


const App = () => {
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider config={config}>
          <MainStack />
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
