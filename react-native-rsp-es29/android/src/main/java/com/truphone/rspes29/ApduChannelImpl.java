package com.truphone.rspes29;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.truphone.apdu.RNApduModule;
import com.truphone.lpa.ApduChannel;
import com.truphone.lpa.ApduTransmittedListener;

import java.util.Arrays;
import java.util.List;

public class ApduChannelImpl implements ApduChannel {
    private ReactApplicationContext reactContext;
    private ApduTransmittedListener apduTransmittedListener;

    public ApduChannelImpl(ReactApplicationContext reactContext) {

        this.reactContext = reactContext;
        apduTransmittedListener = null;
    }

    @Override
    public String transmitAPDU(String apdu) {

        return transmitAPDU(apdu, false);
    }

    private String transmitAPDU(String apdu, boolean isBasicChannel) {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "ApduChannelImpl - transmitAPDU: " + apdu + "; is basic channel? " + isBasicChannel);
        }

        RNApduModule rnApduModule = new RNApduModule(reactContext);
        String result = rnApduModule.sendReceiveApdu(Arrays.asList(apdu), isBasicChannel, apduTransmittedListener);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "ApduChannelImpl - sendCommandLogic - result:" + result + ":");
        }

        return result;
    }

    @Override
    public String transmitAPDUS(List<String> apduList) {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "ApduChannelImpl - transmitAPDUS");
        }

        RNApduModule rnApduModule = new RNApduModule(reactContext);
        String result = rnApduModule.sendReceiveApdu(apduList, false, apduTransmittedListener);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "ApduChannelImpl - transmitAPDUS  - result:" + result + ":");
        }

        return result.toString();
    }

    @Override
    public void sendStatus() {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "ApduChannelImpl - sendStatus");
        }

        try {
            String result = transmitAPDU("80F2000C00", true);

            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "ApduChannelImpl - sendStatus - result: " + result);
            }
        } catch (Exception ignored) {
            Log.w(BuildConfig.TAG, "ApduChannelImpl - sendStatus - IGNORED Exception: " + ignored.getMessage());
        }
    }

    @Override
    public void setApduTransmittedListener(ApduTransmittedListener apduTransmittedListener) {

        this.apduTransmittedListener = apduTransmittedListener;
    }

    @Override
    public void removeApduTransmittedListener(ApduTransmittedListener apduTransmittedListener) {

        if (this.apduTransmittedListener == apduTransmittedListener) {
            this.apduTransmittedListener = null;
        }
    }
}

