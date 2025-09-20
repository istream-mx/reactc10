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
  setCurrentMessageIds,
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
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {
  getTokenDevice,
  requestPermissionsByPlatform,
} from '../utils/notifications';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const isNotificationMode = useSelector(
    state => state.pushNotificationStore.isNotificationMode,
  );

  const dispatch = useDispatch();

  const openModalNotification = hasNoteId => {
    if (hasNoteId != null) {
      dispatch(setNewCurrentId(Number(hasNoteId)));
      dispatch(setIsNotificationMode(true));
    } else {
      dispatch(setIsNotificationMode(false));
    }
  };

   const appTrankingIOSPermissions = async () => {
    const trackingStatus = await getTrackingStatus();
    if (trackingStatus === 'not-determined') {
      // enable tracking features
      requestTrackingPermission();
    }
  };

  React.useEffect(() => {
    const unsubscribeBackGround = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        // console.log('unsubscribeBackGround remoteMessage', remoteMessage);
        const hasNoteId = get(remoteMessage, 'data.note_id', null);
        openModalNotification(hasNoteId);
      },
    );

    if (Platform.OS === 'ios') {
      appTrankingIOSPermissions();
    }

    requestPermissionsByPlatform().then(enabled => {
      if (enabled) {
        getTokenDevice();
        return () => {
          unsubscribeBackGround();
        };
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isNotificationMode ? (
          <>
            <Stack.Screen name="MainDrawer" component={MainDrawer} />
            <Stack.Screen name="NewScreen" component={NewScreen} />
            <Stack.Screen name="GalleryModal" component={GalleryModal} />
            <Stack.Screen name="VideoModal" component={VideoModal} />
            <Stack.Screen name="SearchNewsModal" component={SearchNewsModal} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="NewScreenNotification"
              navigationKey={'NotifiactionScreeen'}
              component={NewScreen}
            />
            <Stack.Screen name="GalleryModal" component={GalleryModal} />
            <Stack.Screen name="VideoModal" component={VideoModal} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
