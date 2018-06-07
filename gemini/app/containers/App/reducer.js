import { combineReducers } from 'redux';
import { NavigationReducer } from '@expo/ex-navigation';
import checkout from '../SelectProduct/reducers.js';
import profile from '../ListProfiles/reducers.js';

const rootReducer = combineReducers({
  navigation: NavigationReducer,
  checkout: checkout,
  profile: profile
});

export default rootReducer;
