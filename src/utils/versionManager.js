import VersionCheck from 'react-native-version-check';
import {ENV} from '../environments';

const DEFAULT_VERSION = {
  isNeeded: false,
  currentVersion: null,
  latestVersion: null,
};

export const checkForUpdate = async () => {
  try {
    if (ENV === 'development') {
      return DEFAULT_VERSION;
    }
    const {isNeeded} = await VersionCheck.needUpdate();
    return isNeeded;
  } catch (error) {
    return DEFAULT_VERSION;
  }
};
