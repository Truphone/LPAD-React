import tlsfuncs from 'react-native-rsp-es29';
import { store } from '../../store';
import {
  CHECKOUT,
  KYC_SUCCESS,
  CONFIRM,
  MODAL,
  CLOSEMODAL,
  PROGRESS,
  DOWNLOAD_PROFILE_START,
  SCAN_DATA
} from './actionTypes';
import { SPLASH } from '../Splash/actionTypes';
import { customLog } from '../../modules/console';
import { createErrorPayload } from '../ListProfiles/actions';
import { LOAD_PROFILES } from '../ListProfiles/actionTypes';

export const updateProgress = (text) => ({
  type: PROGRESS,
  payload: text
});

export function checkout(selected_product) {
  return {
    type: CHECKOUT,
    payload: selected_product
  }
}

export function kyc_success(args) {
  return {
    type: KYC_SUCCESS,
    payload: args
  }
}
export function confirm() {
  return {
    type: CONFIRM
  }
}

export function modal() {
  return {
    type: MODAL
  }
}

export function closemodal() {
  return {
    type: CLOSEMODAL
  }
}

export function scanValues(matchingId2, smdpAddress2) {

  return (dispatch) => {
    dispatch({ type: SCAN_DATA, payload: { matchingId2: matchingId2, smdpAddress2: smdpAddress2 } });
  }
}

export function downloadProfile(matchingId2, smdpAddress2) {

  customLog('downloadProfile - matchingId2 : ' + matchingId2 + '; SMDP Address : ' + smdpAddress2);

  return (dispatch) => {

    dispatch({ type: DOWNLOAD_PROFILE_START });

    if (!matchingId2 || matchingId2.length == 0 || !smdpAddress2 || smdpAddress2.length == 0) {
      customLog('calling downloadOrder');

      tlsfuncs.downloadOrder().then(ok => {
        customLog('downloadOrder DOWNLOAD COMPLETED');

        dispatch({ type: SPLASH });
      }, nok => {
        customLog("Error: " + nok)

        dispatch(createErrorPayload(SPLASH, nok, 'Download Profile Problem', false));
      });
    } else {
      customLog('calling downloadOrder with matchingID: ' + matchingId2 + '; SMDP Address : ' + smdpAddress2);

      tlsfuncs.downloadOrderWithMatchingId(matchingId2, smdpAddress2).then(ok => {
        customLog('downloadOrder DOWNLOAD COMPLETED');

        dispatch({ type: SPLASH });
      }, nok => {
        customLog("Error: " + nok)

        dispatch(createErrorPayload(SPLASH, nok, 'Download Profile Problem', false));
      });
    }
  }
}