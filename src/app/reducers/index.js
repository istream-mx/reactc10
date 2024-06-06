import {combineReducers} from 'redux';
import sideBarPathStore from './sideBarPathStore';
import liveStreamStore from './liveStreamStore';
import updateInfoStore from './updateInfoStore';

const reducers = {
  sideBarPathStore: sideBarPathStore,
  liveStreamStore: liveStreamStore,
  updateInfoStore: updateInfoStore,
};

export default combineReducers(reducers);
