import {
  LOAD_PROFILES,
  SIM_REFRESHED,
  TOGGLE_PROFILE_START,
  TOGGLE_EXTRA,
  DELETE_PROFILE_START
} from './actionTypes';
import { SPLASH } from '../Splash/actionTypes';
import { customLog } from '../../modules/console';

const initialState = {
  profiles: {},
  activeprofile: null,
  isLoading: false,
  error: '',
  errorHeader: '',
  fatalError: false
}

const profiles = (state = initialState, action) => {
  const actionPayload = action.payload;
  let allProfile;

  customLog("start - state: " + JSON.stringify(state));
  customLog("start - action: " + JSON.stringify(action));

  switch (action.type) {
    case LOAD_PROFILES:
      state = {
        ...state,
        profiles: action.payload && action.payload.error && action.payload.error.length > 0 ? {} : actionPayload,
        activeprofile: Object.keys(actionPayload).filter((i) => actionPayload[i].status == 1).map((i) => actionPayload[i])[0],
        isLoading: false,
        error: action.payload && action.payload.error && action.payload.error.length > 0 ? action.payload.error : '',
        errorHeader: action.payload && action.payload.errorHeader && action.payload.errorHeader.length > 0 ? action.payload.errorHeader : '',
        fatalError: action.payload && action.payload.fatalError ? action.payload.fatalError : false
      }
      break;

    case SPLASH:
    case SIM_REFRESHED:
      state = {
        ...state,
        error: action.payload && action.payload.error && action.payload.error.length > 0 ? action.payload.error : '',
        errorHeader: action.payload && action.payload.errorHeader && action.payload.errorHeader.length > 0 ? action.payload.errorHeader : '',
        profiles: {},
        activeprofile: null,
        //isLoading: false,
        fatalError: action.payload && action.payload.fatalError ? action.payload.fatalError : false
      }
      break;

    case TOGGLE_EXTRA:
      let new_profiles = state.profiles;

      Object.keys(new_profiles).forEach(i => i.extra = false);

      new_profiles[actionPayload].extra = !state.profiles[actionPayload].extra;
      state = {
        ...state,
        profiles: new_profiles,
        isLoading: false,
        error: '',
        errorHeader: ''
      }
      break;

    case TOGGLE_PROFILE_START:
      allProfile = state.profiles;
      allProfile[actionPayload].status = state.profiles[actionPayload].status === 0 ? 1 : 0;
      state = {
        ...state,
        profiles: allProfile,
        activeprofile: state.profiles[actionPayload].status === 0 ? state.profiles[actionPayload] : null,
        isLoading: true,
        error: '',
        errorHeader: ''
      }
      break;

    case DELETE_PROFILE_START:
      state = {
        ...state,
        isLoading: true,
        error: '',
        errorHeader: ''
      }
      break;

    default:
      state = state
      break;
  }

  customLog("end - action: " + JSON.stringify(action));
  customLog("end - state: " + JSON.stringify(state));

  return state;
}

export default profiles;
