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
import {
  Platform,
  PermissionsAndroid,
  PermissionStatus,
  AppState,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {
  registerTokenNotificationDevice,
  setIsNotificationMode,
} from '../app/reducers/pushNotificationStore';
import {get} from 'lodash';
import {setNewCurrentId} from '../app/reducers/newStore';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {setStatusNotificationPermission} from '../app/reducers/persitStore';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const updateInfo = useSelector(state => state.updateInfoStore.updateInfo);
  const isNotificationMode = useSelector(
    state => state.pushNotificationStore.isNotificationMode,
  );
  const localStatusNotifiactionPermission = useSelector(
    state => state.persitStore.statusNotificationPermission,
  );

  const hasCheckForUpdate = useSelector(
    state => state.updateInfoStore.hasCheckForUpdate,
  );

  const dispatch = useDispatch();

  const hasNoteIdByDeviceType = (notification, typeDevice) => {
    switch (typeDevice) {
      case 'ios':
        return get(notification, 'data.aps.target-content-id', null);

      case 'android':
        return get(notification, 'data.note_id', null);
      default:
        return null;
    }
  };

  const hasFinishByDeviceType = (notification, typeDevice) => {
    switch (typeDevice) {
      case 'ios':
        return get(notification, 'data.finish', null);

      case 'android':
        return get(notification, 'finish', null);
      default:
        return null;
    }
  };

  const openModalNotification = hasNoteId => {
    if (hasNoteId != null) {
      dispatch(setNewCurrentId(Number(hasNoteId)));
      dispatch(setIsNotificationMode(true));
    } else {
      dispatch(setIsNotificationMode(false));
    }
  };

  const notificationConfiguration = () => {
    PushNotification.configure({
      onRegister: function (token) {
        dispatch(
          registerTokenNotificationDevice({
            tokenNotification: token.token,
            typeDevice: token.os,
          }),
        )
          .then(_response => {
            // console.log({response});
          })
          .catch(error => {
            console.log({error});
          });
        // console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        // console.log('NOTIFICATION:', notification.data.note_id);
        let hasNoteId = hasNoteIdByDeviceType(notification, Platform.OS);
        let hasFinish = hasFinishByDeviceType(notification, Platform.OS);
        if (AppState.currentState != 'active') {
          openModalNotification(hasNoteId);
        } else {
          // console.log('NOTIFICATION:', notification);
          if (Platform.OS == 'android') {
            PushNotification.localNotification(notification);
          }
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        if (hasFinish != null) {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
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
  };

  const checkApplicationPermission = async () => {
    checkNotifications().then(({status, _settings}) => {
      // console.log({status});
      if (status == 'granted') {
        dispatch(setStatusNotificationPermission(status));
        notificationConfiguration();
      } else if (
        status != 'granted' &&
        localStatusNotifiactionPermission == null
      ) {
        requestNotifications(['alert', 'sound', 'badge']).then(
          ({status, _settings}) => {
            dispatch(setStatusNotificationPermission(status));
            if (status == 'granted') {
              notificationConfiguration();
            }
            // console.log({status});
          },
        );
      } else {
        dispatch(setStatusNotificationPermission(status));
        console.log({status});
      }
    });
  };

  React.useEffect(() => {
    const checkVersion = async () => {
      const res = await checkForUpdate();
      dispatch(setHasCheckForUpdate(true));
      dispatch(setUpdateInfo(res));
    };
    checkVersion();
    checkApplicationPermission();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {hasCheckForUpdate && updateInfo.isNeeded ? (
          <>
            <Stack.Screen
              name="UpdateAvailableScreen"
              component={UpdateAvailableScreen}
              initialParams={updateInfo}
            />
          </>
        ) : (
          <>
            {!isNotificationMode ? (
              <>
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
              </>
            ) : (
              <>
                <Stack.Screen
                  name="NewScreenNotification"
                  navigationKey={'NotifiactionScreeen'}
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
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
