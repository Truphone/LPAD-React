package com.truphone.apdu;

import android.content.Context;
import android.telephony.IccOpenLogicalChannelResponse;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.truphone.lpa.ApduTransmittedListener;

import java.util.List;

public class RNApduModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNApduModule(ReactApplicationContext reactApplicationContext) {

        super(reactApplicationContext);

        this.reactContext = reactApplicationContext;
    }

    @Override
    public String getName() {

        return "RNApdu";
    }

    private int openChannel(String iccLogicalChannelId) {
        int channel;
        IccOpenLogicalChannelResponse iccOpenLogicalChannel = getIccOpenLogicalChannel(iccLogicalChannelId);

        checkIccOpenLogicalChannelResponse(iccOpenLogicalChannel);

        channel = iccOpenLogicalChannel.getChannel();

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - openChannel - channel opened with id: " + channel);
        }

        return channel;
    }

    private void checkIccOpenLogicalChannelResponse(IccOpenLogicalChannelResponse iccOpenLogicalChannelResponse) {

        switch (iccOpenLogicalChannelResponse.getStatus()) {
            case IccOpenLogicalChannelResponse.STATUS_NO_ERROR:
                break;

            default:
                Log.e(BuildConfig.TAG, "RNApduModule - openChannel - COULD NOT OPEN CHANNEL! Status: " + iccOpenLogicalChannelResponse.getStatus());

                throw new RuntimeException("Could not open APDU Channel. Check Privileges!");
        }
    }

    private IccOpenLogicalChannelResponse getIccOpenLogicalChannel(String iccLogicalChannelId) {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - openChannel - AID: " + iccLogicalChannelId);
        }

        TelephonyManager telephonyManager = (TelephonyManager) reactContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        IccOpenLogicalChannelResponse iccOpenLogicalChannelResponse = telephonyManager.iccOpenLogicalChannel(iccLogicalChannelId);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - openChannel - IccOpenLogicalChannelResponse: " + iccOpenLogicalChannelResponse);
        }

        return iccOpenLogicalChannelResponse;
    }

    private void closeChannel(Channel channel, boolean isBasicChannel) {

        if (!isBasicChannel) {
            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "RNApduModule - closeChannel - channel: " + channel.getChannel());
            }

            TelephonyManager telephonyManager = (TelephonyManager) reactContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            boolean isIccLogicalChannelClosed = telephonyManager.iccCloseLogicalChannel(channel.getChannel());

            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "RNApduModule - closeChannel - isIccLogicalChannelClosed: " + isIccLogicalChannelClosed);
            }
        } else {
            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "RNApduModule - closeChannel - BASIC channel is not to be closed");
            }
        }
    }

    private String sendCommandLogic(int channel, String apdu, boolean isBasicChannel) {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - apdu : " + apdu + "; is basic? " + isBasicChannel);
        }

        int cla, instruction, p1, p2, p3;
        String data;
        TelephonyManager telephonyManager = (TelephonyManager) reactContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        String cmd = apdu;
        String result;

        cla = Integer.parseInt(cmd.substring(0, 2), 16);
        instruction = Integer.parseInt(cmd.substring(2, 4), 16);
        p1 = Integer.parseInt(cmd.substring(4, 6), 16);
        p2 = Integer.parseInt(cmd.substring(6, 8), 16);
        p3 = Integer.parseInt(cmd.substring(8, 10), 16);
        data = cmd.substring(10);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - cla : " + cla);
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - instruction : " + instruction);
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - p1 : " + p1);
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - p2 : " + p2);
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - p3 : " + p3);
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic - data : " + data);
        }

        if (isBasicChannel) {
            result = telephonyManager.iccTransmitApduBasicChannel(cla, instruction, p1, p2, p3, data);
        } else {
            result = telephonyManager.iccTransmitApduLogicalChannel(channel, cla, instruction, p1, p2, p3, data);
        }

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - sendCommandLogic returning - " + result);
        }

        return result;
    }

    public String sendReceiveApdu(List apduList, boolean isBasicChannel, ApduTransmittedListener apduTransmittedListener) {
        StringBuffer result = new StringBuffer();
        Channel channel = null;
        String tempResult;

        if (!isBasicChannel) {
            channel = new Channel();
        }

        for (Object apdu : apduList) {
            tempResult = sendReceiveApdu((String) apdu, channel, isBasicChannel);

            result.append(tempResult);

            if (apduTransmittedListener != null) {
                apduTransmittedListener.onApduTransmitted();
            }

            // Response included more than status word. It is necessary to process the non empty result.
            // For that reason, it is not convenient to send more APDUs (ex: probably profile installation failed.
            // status word in this case is 9000 but there is a profile installation result to be analysed. If
            // More APDUs are sent after this a 6a80 status word will occur.
            if (tempResult.length() > 0) {
                break;
            }
        }

        closeChannel(channel, isBasicChannel);

        return result.toString();
    }

    private String sendReceiveApdu(String apdu, Channel channel, boolean isBasicChannel) {
        String result = sendCommandLogic(channel != null ? channel.getChannel() : -1, apdu, isBasicChannel);
        String statusWord;

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - sendReceiveApdu - result:" + result + ":");
        }

        statusWord = result.substring(result.length() - 4);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - sendReceiveApdu - statusWord:" + statusWord + ":");
        }

        result = processStatusWord(channel, isBasicChannel, result, statusWord);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - sendReceiveApdu - returning:" + result + ":");
        }

        return result;
    }

    private String processStatusWord(Channel channel, boolean isBasicChannel, String sentApduResult, String statusWord) {

        if (statusWord.startsWith("61")) {
            sentApduResult = processMoreDataStatusWord(channel, isBasicChannel, sentApduResult, statusWord);
        } else if ("9900".equals(statusWord)) {
            sentApduResult = processModemOkStatusWord(channel, isBasicChannel, sentApduResult);
        } else if (!"9000".equals(statusWord)) {
            return processNokStatusWord(channel, isBasicChannel, statusWord);
        } else {
            sentApduResult = processOkStatusWord(sentApduResult, statusWord);
        }
        return sentApduResult;
    }

    private String processNokStatusWord(Channel channel, boolean isBasicChannel, String statusWord) {

        closeChannel(channel, isBasicChannel);

        throw new RuntimeException("Problems while transmitting APDUs! status word: " + statusWord);
    }

    private String processOkStatusWord(String sentApduResult, String statusWord) {

        sentApduResult = sentApduResult.substring(0, sentApduResult.length() - 4);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - processOkStatusWord - success status word: " + statusWord);
            Log.d(BuildConfig.TAG, "RNApduModule - processOkStatusWord - calculated sentApduResult for success:" + sentApduResult + ":");
        }

        return sentApduResult;
    }

    private String processModemOkStatusWord(Channel channel, boolean isBasicChannel, String sentApduResult) {
        String word = "D0C0000000";

        return processMoreData(channel, isBasicChannel, sentApduResult, word);
    }

    private String processMoreData(Channel channel, boolean isBasicChannel, String sentApduResult, String word) {
        String response = sentApduResult.substring(0, sentApduResult.length() - 4);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - processMoreData - Fetching for request : " + word);
            Log.d(BuildConfig.TAG, "RNApduModule - processMoreData - calculated response for partial:" + response + ":");
        }

        sentApduResult = response + sendReceiveApdu(word, channel, isBasicChannel);

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNApduModule - processMoreData - calculated sentApduResult:" + sentApduResult + ":");
        }

        return sentApduResult;
    }

    private String processMoreDataStatusWord(Channel channel, boolean isBasicChannel, String sentApduResult, String statusWord) {
        String word = "8" + channel.getChannel() + "C00000" + statusWord.substring(2);

        return processMoreData(channel, isBasicChannel, sentApduResult, word);
    }

    private class Channel {
        private int channel;

        public int getChannel() {

            return channel;
        }

        public Channel() {

            channel = openChannel("A0000005591010FFFFFFFF8900000100");


            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "RNApduModule - channel Opened with id: " + channel);
            }
        }
    }
}