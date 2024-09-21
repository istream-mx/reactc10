import {combineReducers} from 'redux';
import sideBarPathStore from './sideBarPathStore';
import liveStreamStore from './liveStreamStore';
import updateInfoStore from './updateInfoStore';
import newStore from './newStore';
import pushNotificationStore from './pushNotificationStore';

const reducers = {
  sideBarPathStore: sideBarPathStore,
  liveStreamStore: liveStreamStore,
  newStore: newStore,
  updateInfoStore: updateInfoStore,
  pushNotificationStore: pushNotificationStore
};

export default combineReducers(reducers);
