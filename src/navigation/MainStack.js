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
import {GalleryModal} from '../screens/GalleryModal';
import {VideoModal} from '../screens/VideoModal';
import {SearchNewsModal} from '../screens/SearchNewsModal';
import {Platform, PermissionsAndroid, PermissionStatus} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {registerTokenNotificationDevice} from '../app/reducers/pushNotificationStore';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const updateInfo = useSelector(state => state.updateInfoStore.updateInfo);
  const hasCheckForUpdate = useSelector(
    state => state.updateInfoStore.hasCheckForUpdate,
  );

  const dispatch = useDispatch();

  const hasAndroidPermissions = async () => {
    let notificationsPermissionCheck = 'granted';

    if (Number(Platform.Version) >= 33) {
      notificationsPermissionCheck = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    return notificationsPermissionCheck == 'granted';
  };

  const checkApplicationPermission = async () => {
    if (Platform.OS == 'android') {
      if (await hasAndroidPermissions()) {
        PushNotification.configure({
          onRegister: function (token) {
            dispatch(
              registerTokenNotificationDevice({
                tokenNotification: token.token,
                typeDevice: token.os,
              }),
            )
              .then(response => {
                console.log({response});
              })
              .catch(error => {
                console.log({error});
              });
            console.log('TOKEN:', token);
          },
          onNotification: function (notification) {
            console.log('NOTIFICATION:', notification.data.note_id);
            
            // process the notification

            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          },
          onRegistrationError: function (err) {
            console.error(err.message, err);
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
          popInitialNotification: true,
          requestPermissions: true,
        });
      } else {
        console.log('Notification permission denied');
      }
    } else {
    }
  };

  React.useEffect(() => {
    const checkVersion = async () => {
      const res = await checkForUpdate();
      dispatch(setHasCheckForUpdate(true));
      dispatch(setUpdateInfo(res));
    };
    checkApplicationPermission();
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
