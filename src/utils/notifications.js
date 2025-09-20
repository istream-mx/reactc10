import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {CONSUMER_KEY} from '../environments';
import {createTokenNotification} from '../services/NotificationApi';
import {useDispatch} from 'react-redux';
import {setNewCurrentId} from '../app/reducers/newStore';
import {setIsNotificationMode} from '../app/reducers/pushNotificationStore';
const consumerKey = CONSUMER_KEY;

const requestPermissionsIOS = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

const requestPermissionsAndroid = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Notification permissions:', granted);
    // getToken();
    return true;
  } else {
    console.log('Notification permissions:', 'denied');
    return false;
  }
};

export const getTokenDevice = async () => {
  try {
    const token = await messaging().getToken();

    const response = await createTokenNotification({
      token: consumerKey,
      tokenNotification: token,
      typeDevice: Platform.OS === 'ios' ? 'fcm' : Platform.OS,
    });
    // console.log('FCM Token', token);
    return response;
  } catch (error) {
    console.error('Failed to get FCM token', error);
  }
};

export const changeDataNotification = hasNoteId => {
  const dispatch = useDispatch();

  if (hasNoteId != null) {
    dispatch(setNewCurrentId(Number(hasNoteId)));
    dispatch(setIsNotificationMode(true));
  } else {
    dispatch(setIsNotificationMode(false));
  }
};

export const requestPermissionsByPlatform = async () => {
  if (Platform.OS === 'android') {
    return await requestPermissionsAndroid();
  } else {
    return await requestPermissionsIOS();
  }
};

export const useNotification = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissionsAndroid();
    } else {
      requestPermissionsIOS();
    }
  }, []);
};
