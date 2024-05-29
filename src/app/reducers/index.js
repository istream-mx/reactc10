import {combineReducers} from 'redux';
import sideBarPathStore from './sideBarPathStore';

const reducers = {
  sideBarPathStore: sideBarPathStore,
};

export default combineReducers(reducers);
