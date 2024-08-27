import {combineReducers} from 'redux';
import sideBarPathStore from './sideBarPathStore';
import liveStreamStore from './liveStreamStore';
import updateInfoStore from './updateInfoStore';
import newStore from './newStore';

const reducers = {
  sideBarPathStore: sideBarPathStore,
  liveStreamStore: liveStreamStore,
  newStore: newStore,
  updateInfoStore: updateInfoStore,
};

export default combineReducers(reducers);
