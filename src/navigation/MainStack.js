import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import MainDrawer from './MainDrawer';
import {useDispatch, useSelector} from 'react-redux';
import {UpdateAvailableScreen} from '../screens/UpdateAvailableScreen';
import {checkForUpdate} from '../utils/versionManager';
import {
  setHasCheckForUpdate,
  setUpdateInfo,
} from '../app/reducers/updateInfoStore';
import {NewScreen} from '../screens/NewScreen';
import { GalleryModal } from '../screens/GalleryModal';
import { VideoModal } from '../screens/VideoModal';
import { SearchNewsModal } from '../screens/SearchNewsModal';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const updateInfo = useSelector(state => state.updateInfoStore.updateInfo);
  const hasCheckForUpdate = useSelector(
    state => state.updateInfoStore.hasCheckForUpdate,
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    const checkVersion = async () => {
      const res = await checkForUpdate();
      dispatch(setHasCheckForUpdate(true));
      dispatch(setUpdateInfo(res));
    };

    checkVersion();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {hasCheckForUpdate && updateInfo.isNeeded ? (
          <Stack.Group>
            <Stack.Screen
              name="UpdateAvailableScreen"
              component={UpdateAvailableScreen}
              initialParams={updateInfo}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainDrawer" component={MainDrawer} />
            <Stack.Screen
              name="NewScreen"
              component={NewScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GalleryModal"
              component={GalleryModal}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="VideoModal"
              component={VideoModal}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SearchNewsModal"
              component={SearchNewsModal}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
