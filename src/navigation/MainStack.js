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
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
