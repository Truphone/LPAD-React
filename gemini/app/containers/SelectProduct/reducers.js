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
import { customLog } from '../../modules/console';

const initialState = {
  selected_product: 1,
  infoconfirm: false,
  modal: false,
  header: 'Please Wait',
  error: '',
  progress: 0,
  errorHeader: '',
  matchingId2: '',
  smdpAddress2: ''
}

const checkout = (state = initialState, action) => {

  customLog("SelectProduct Reducer - state: " + JSON.stringify(state));
  customLog("SelectProduct Reducer - action: " + JSON.stringify(action));

  switch (action.type) {
    case CHECKOUT:
      return {
        ...state,
        selected_product: action.payload,
        infoconfirm: false,
        modal: false,
        header: 'Please Wait',
        error: '',
        progress: 0,
        errorHeader: '',
        matchingId2: '',
        smdpAddress2: ''
      }

    case KYC_SUCCESS:
      return {
        ...state,
        infocollected: true,
        myinfo: action.payload,
        header: 'Please Wait',
        error: '',
        progress: 0,
        errorHeader: '',
        matchingId2: '',
        smdpAddress2: ''
      }

    case CONFIRM:
      return {
        ...state,
        infoconfirm: true,
        header: 'Please Wait',
        error: '',
        progress: 0,
        errorHeader: '',
        matchingId2: '',
        smdpAddress2: ''
      }

    case MODAL:
      return {
        ...state,
        modal: true,
        header: 'Please Wait',
        error: '',
        progress: 0,
        errorHeader: ''
      }

    case CLOSEMODAL:
      return {
        ...state,
        modal: false,
        header: 'Please Wait',
        error: '',
        progress: 0,
        errorHeader: ''
      }

    case PROGRESS:
      return {
        ...state,
        progress: action.payload.percentage,
        header: action.payload.header
      }

    case DOWNLOAD_PROFILE_START:
      return {
        ...state,
        header: 'Please Wait',
        error: '',
        progress: 0
      }

    case SCAN_DATA:
      return {
        ...state,
        matchingId2: action.payload.matchingId2,
        smdpAddress2: action.payload.smdpAddress2
      }

    default:
      return state
  }
}

export default checkout;
