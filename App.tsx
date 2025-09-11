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

const App = () => {
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
