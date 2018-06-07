import { takeEvery } from 'redux-saga/effects';
import { take, put, fork, select } from 'redux-saga/effects';
import { NavigationActions } from '@expo/ex-navigation'
import { listProfiles } from '../ListProfiles/actions';
import { router } from '../../router';
import {
  LOAD_PROFILES,
  SIM_REFRESHED
} from '../ListProfiles/actionTypes';
import { CHECKOUT } from '../SelectProduct/actionTypes';
import { SPLASH } from '../Splash/actionTypes';
import { customLog } from '../../modules/console';

function* onRehydrate() {

  customLog('onRehydrate');

  try {
    yield put(listProfiles());
    yield take(LOAD_PROFILES)
    yield onLoadProfiles();
  }
  catch (e) {
    alert('' + e);
  }
}

function* onLoadProfiles() {

  customLog('onLoadProfiles');

  let state = yield select();

  customLog(state);

  if (Object.keys(state.profile.profiles).length > 0) {
    NavigationActions.immediatelyResetStack('root', router.getRoute('profiles'));
    yield put(NavigationActions.replace('root', router.getRoute('profiles')))
  }
  else {
    NavigationActions.immediatelyResetStack('root', router.getRoute('home'));
    yield put(NavigationActions.replace('root', router.getRoute('home')))
  }
}

export function* onInit() {

  customLog('onInit');

  try {
    yield takeEvery(SPLASH, onRehydrate);
  }
  catch (e) {
    alert(e);
  }
}

export function* watchCheckout() {

  customLog('watchCheckout');

  try {
    yield takeEvery(CHECKOUT, () => { return put(NavigationActions.push('root', router.getRoute('summary'))) });
  }
  catch (e) {
    alert(e);
  }
}

export function* watchSimRefreshed() {

  customLog('watchSimRefreshed');

  try {
    yield takeEvery(SIM_REFRESHED, () => { return onRehydrate() });
  }
  catch (e) {
    alert(e);
  }
}

export default function* root() {
  try {
    yield [
      fork(onInit),
      fork(watchCheckout),
      fork(watchSimRefreshed)
    ]
  }
  catch (e) {
    alert(e);
  }
}
