const RN_IS_DEBUG = true;
const RN_TAG = "KOL.007";

export function customLog(message) {

    if (RN_IS_DEBUG) {
        console.log(RN_TAG + ' - ' + message);
    }
};
