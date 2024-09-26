import {combineReducers} from 'redux';
import sideBarPathStore from './sideBarPathStore';
import liveStreamStore from './liveStreamStore';
import updateInfoStore from './updateInfoStore';
import newStore from './newStore';
import pushNotificationStore from './pushNotificationStore';
import persitStore from './persitStore';

const reducers = {
  sideBarPathStore: sideBarPathStore,
  liveStreamStore: liveStreamStore,
  newStore: newStore,
  updateInfoStore: updateInfoStore,
  pushNotificationStore: pushNotificationStore,
  persitStore: persitStore,
};

export default combineReducers(reducers);
