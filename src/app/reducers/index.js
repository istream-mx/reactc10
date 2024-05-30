import {combineReducers} from 'redux';
import sideBarPathStore from './sideBarPathStore';
import liveStreamStore from './liveStreamStore';

const reducers = {
  sideBarPathStore: sideBarPathStore,
  liveStreamStore: liveStreamStore,
};

export default combineReducers(reducers);
