import tlsfuncs from 'react-native-rsp-es29';
import {
  LOAD_PROFILES,
  TOGGLE_PROFILE_START,
  DELETE_PROFILE_START,
  SIM_REFRESHED,
  TOGGLE_EXTRA
} from '../ListProfiles/actionTypes';
import { customLog } from '../../modules/console';
import { SPLASH } from '../Splash/actionTypes';

export function createErrorPayload(type, error, errorHeader, fatalError) {

  return {
    type: type,
    payload: {
      error: '' + error,
      errorHeader: errorHeader,
      fatalError: fatalError
    }
  }
}

export function listProfiles() {

  return async (dispatch) => {
    let profiles = {};

    try {
      customLog('List Profiles invoking server')

      response = await tlsfuncs.listProfiles();

      customLog('List Profiles Response (SERVER) : ' + response);

      for (i = 0; i < response.length; i++) {
        let { ICCID, NAME, STATE } = response[i];

        profiles[ICCID] = {
          status: STATE === 'Disabled' ? 0 : 1,
          iccid: ICCID,
          aid: NAME,
          extra: false
        };
      }

      customLog('List Profiles Response (Converted) : ' + profiles);

      dispatch({ type: LOAD_PROFILES, payload: profiles });
    }
    catch (error) {
      dispatch(createErrorPayload(LOAD_PROFILES, error, 'List Profiles Problem', true));
    }
  }
}

export function toggleProfile(iccid, value) {

  return async (dispatch) => {
    if (value) {
      dispatch({ type: TOGGLE_PROFILE_START, payload: iccid });

      customLog('toggleProfile/enableProfile - enableProfile (server) iccid: ' + iccid);

      await tlsfuncs.enableProfile(iccid)
        .then((resp) => {
          customLog('toggleProfile/enableProfile - enableProfile resp: ' + resp);
        }).catch((e) => {
          customLog('toggleProfile/enableProfile - ERROR - exception: ' + e);

          dispatch(createErrorPayload(SPLASH, error, 'Toggle Profile Problem', false));
        });
    }
    else {
      dispatch({ type: TOGGLE_PROFILE_START, payload: iccid });

      customLog('toggleProfile/disableProfile - disableProfile (server) iccid: ' + iccid);

      await tlsfuncs.disableProfile(iccid)
        .then((resp) => {
          customLog('toggleProfile/disableProfile - disableProfile resp: ' + iccid);
        }).catch((e) => {
          customLog('toggleProfile/disableProfile - ERROR - exception: ' + e);

          dispatch(createErrorPayload(SPLASH, error, 'Toggle Profile Problem', false));
        });
    }
  }
}

export function deleteProfile(iccid) {

  customLog("deleteProfile params - iccid: " + iccid);

  return async (dispatch) => {
    dispatch({ type: DELETE_PROFILE_START });

    customLog("deleteProfile - invoking server");

    await tlsfuncs.deleteProfile(iccid).then((resp) => {
      customLog("deleteProfile - server response: " + resp);

      dispatch({ type: SPLASH });
    }).catch((eio) => {
      customLog("deleteProfile - ERROR - exception: " + eio);

      dispatch(createErrorPayload(SPLASH, eio, 'Delete Profile Problem', false));
    });
  }
}

export function sim_refreshed() {
  return {
    type: SIM_REFRESHED
  }
}

export function extra(iccid) {
  return {
    type: TOGGLE_EXTRA,
    payload: iccid
  }
}

export function reloadListProfiles() {
  return {
    type: SPLASH
  }
}