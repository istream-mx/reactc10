/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {config} from './gluestack-ui.config';
import {Provider} from 'react-redux';
import {store, persistor} from './src/app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import MainStack from './src/navigation/MainStack';
import SplashScreen from 'react-native-splash-screen';
import {Platform} from 'react-native';
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
