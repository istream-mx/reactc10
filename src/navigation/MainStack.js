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
import {Platform, AppState} from 'react-native';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification, {Importance} from 'react-native-push-notification';
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
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';

const Stack = createNativeStackNavigator();

const MainStack = () => {
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

  // const hasFinishByDeviceType = (notification, typeDevice) => {
  //   switch (typeDevice) {
  //     case 'ios':
  //       return get(notification, 'data.finish', null);

  //     case 'android':
  //       return get(notification, 'finish', null);
  //     default:
  //       return null;
  //   }
  // };

  // const openModalNotification = hasNoteId => {
  //   if (hasNoteId != null) {
  //     dispatch(setNewCurrentId(Number(hasNoteId)));
  //     dispatch(setIsNotificationMode(true));
  //   } else {
  //     dispatch(setIsNotificationMode(false));
  //   }
  // };

  // const pushLocalNotification = notification => {
  //   PushNotification.localNotification({
  //     channelId: notification.channelId,
  //     ...notification,
  //   });
  // };

  // const notificationConfiguration = () => {
  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       dispatch(
  //         registerTokenNotificationDevice({
  //           tokenNotification: token.token,
  //           typeDevice: token.os,
  //         }),
  //       )
  //         .then()
  //         .catch(error => {
  //           console.log({error});
  //         });
  //     },
  //     onNotification: function (notification) {
  //       let hasNoteId = get(notification, 'data.note_id', null);
  //       let hasFinish = hasFinishByDeviceType(notification, Platform.OS);

  //       if (Platform.OS == 'android' && AppState.currentState == 'active') {
  //         PushNotification.channelExists(
  //           notification.channelId,
  //           function (exists) {
  //             if (exists) {
  //               pushLocalNotification(notification);
  //             } else {
  //               PushNotification.createChannel(
  //                 {
  //                   channelId: notification.channelId,
  //                   channelName: 'Noticias',
  //                   soundName: 'default',
  //                   importance: Importance.HIGH,
  //                   vibrate: true,
  //                 },
  //                 _created => pushLocalNotification(notification),
  //               );
  //             }
  //           },
  //         );
  //       }
  //       if (notification.userInteraction) {
  //         openModalNotification(hasNoteId);
  //       }

  //       if (hasFinish != null) {
  //         notification.finish(PushNotificationIOS.FetchResult.NoData);
  //       }
  //     },
  //     onAction: function (notification) {
  //       console.log('ACTION:', notification.action);
  //       console.log('NOTIFICATION:', notification);

  //       // process the action
  //     },
  //     onRegistrationError: function (err) {
  //       console.error(err.message, err);
  //     },
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true,
  //   });
  // };

  // const checkApplicationPermission = async () => {
  //   await checkNotifications().then(({status, _settings}) => {
  //     // console.log({status});
  //     if (status == 'granted') {
  //       dispatch(setStatusNotificationPermission(status));
  //       notificationConfiguration();
  //     } else if (
  //       status != 'granted' &&
  //       localStatusNotifiactionPermission == null
  //     ) {
  //       requestNotifications(['alert', 'sound', 'badge']).then(
  //         ({status, _settings}) => {
  //           dispatch(setStatusNotificationPermission(status));
  //           if (status == 'granted') {
  //             notificationConfiguration();
  //           }
  //           // console.log({status});
  //         },
  //       );
  //     } else {
  //       dispatch(setStatusNotificationPermission(status));
  //       console.log({status});
  //     }
  //   });
  // };

  // const appTrankingIOSPermissions = async () => {
  //   const trackingStatus = await getTrackingStatus();
  //   if (trackingStatus === 'not-determined') {
  //     requestTrackingPermission();
  //   }
  // };

  // React.useEffect(() => {
    
  //   checkApplicationPermission();
  //   if (Platform.OS === 'ios') {
  //     appTrankingIOSPermissions();
  //   }
  // }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
