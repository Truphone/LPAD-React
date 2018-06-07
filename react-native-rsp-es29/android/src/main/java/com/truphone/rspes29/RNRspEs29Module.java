package com.truphone.rspes29;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.annotation.NonNull;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.truphone.lpa.impl.LocalProfileAssistantImpl;
import com.truphone.lpa.progress.DownloadProgress;
import com.truphone.lpa.progress.Progress;
import com.truphone.lpa.progress.ProgressListener;
import com.truphone.util.LogStub;

import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Level;


public class RNRspEs29Module extends ReactContextBaseJavaModule {
    private static final String RSP_SERVER_URL_PROP = "rsp.server.url";
    private static final ReentrantLock lock = new ReentrantLock();

    private final ReactApplicationContext reactContext;
    private final SystemProperties systemProperties;

    public RNRspEs29Module(ReactApplicationContext reactContext) {

        super(reactContext);

        this.reactContext = reactContext;
        systemProperties = new SystemProperties();

        LogStub.getInstance().setLogLevel(BuildConfig.IS_DEBUG ? Level.FINE : Level.INFO);
        LogStub.getInstance().setTag(BuildConfig.TAG);
        LogStub.getInstance().setAndroidLog(true);
    }

    @Override
    public String getName() {

        return "RNRspEs29";
    }

    @ReactMethod
    public void downloadOrder(final Promise promise) {

        Thread r = new Thread() {

            @Override
            public void run() {

                try {
                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - downloadOrder - running");
                    }

                    lock.lock();

                    LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), getDefaultRspServerUrl());
                    DownloadProgress progress = createProgress();
                    String matchingId = getMatchingId(localProfileAssistant);

                    localProfileAssistant.downloadProfile(matchingId, progress);

                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - downloadOrder - invoked downloadProfile");
                    }

                    promise.resolve("DOWNLOAD COMPLETED");
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);

                    promise.reject(ex);
                } finally {
                    unlock();
                }
            }

            private String getMatchingId(LocalProfileAssistantImpl localProfileAssistant) {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - downloadOrder - obtaining matchingId");
                }

                String matchingId = localProfileAssistant.allocateProfile(getMcc());

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - downloadOrder - matchingId: " + matchingId);
                }

                return matchingId;
            }
        };

        r.start();
    }

    private void unlock() {

        if (lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }

    private String getMcc() {
        TelephonyManager telephonyManager = (TelephonyManager) reactContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        String networkOperator = telephonyManager.getNetworkOperator();

        if (StringUtils.isNotBlank(networkOperator) && networkOperator.length() >= 3) {
            networkOperator = networkOperator.substring(0, 3);
        } else {
            Log.e(BuildConfig.TAG, "RNRspEs29Module - getMcc - MCC null or less than 3. mcc: " + networkOperator);

            throw new RuntimeException("Invalid Network Operator. Cannot Download a profile.");
        }

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNRspEs29Module - getMcc - mcc: " + networkOperator);
        }

        return networkOperator;
    }

    private String getDefaultRspServerUrl() {
        String propertyValue = systemProperties.getPropertyValue(RSP_SERVER_URL_PROP);
        String rspServerUrl = StringUtils.isBlank(propertyValue) ? getBuildConfigRspServerUrl() : propertyValue;

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNRspEs29Module - getDefaultRspServerUrl - rspServerUrl: " + rspServerUrl);
        }

        return rspServerUrl;
    }

    @NonNull
    private String getBuildConfigRspServerUrl() {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "RNRspEs29Module - getBuildConfigRspServerUrl - " + BuildConfig.RSP_SERVER_URL);
        }

        return BuildConfig.RSP_SERVER_URL;
    }

    private DownloadProgress createProgress() {
        DownloadProgress progress = new DownloadProgress();
        ProgressListener progressListener = new ProgressListener() {
            private Executor executor = Executors.newSingleThreadExecutor();

            @Override
            public void onAction(final String phase, final String step, final Double percentage, final String message) {
                final WritableMap map = Arguments.createMap();

                map.putString("key", phase);
                map.putString("message", message);
                map.putDouble("percentage", percentage);

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - ProgressListener - key: " + phase + "; message: " + message
                            + "; percentage: " + percentage + "; step: " + step);
                }

                executor.execute(new Runnable() {

                    @Override
                    public void run() {

                        if (BuildConfig.IS_DEBUG) {
                            Log.d(BuildConfig.TAG, "RNRspEs29Module - ProgressListener - emitting DOWNLOAD_PROGRESS. phase: " + phase + "; message: " + message
                                    + "; percentage: " + percentage + "; step: " + step);
                        }

                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("DOWNLOAD_PROGRESS", map);
                    }
                });
            }
        };

        progress.setProgressListener(progressListener);

        return progress;
    }

    @ReactMethod
    public void downloadOrderWithMatchingId(final String matchingId, final String smdpAddress, final Promise promise) {

        Thread r = new Thread() {

            @Override
            public void run() {

                try {
                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - downloadOrderWithMatchingId - running - matchingId: " +
                                matchingId + "; smdpAddress:" + smdpAddress);
                    }

                    lock.lock();

                    LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), smdpAddress);
                    DownloadProgress progress = createProgress();

                    localProfileAssistant.downloadProfile(matchingId, progress);

                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - downloadOrderWithMatchingId - invoked downloadProfile");
                    }

                    promise.resolve("DOWNLOAD COMPLETED");
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);

                    promise.reject(ex);
                } finally {
                    unlock();
                }
            }
        };

        r.start();
    }

    @ReactMethod
    public void deleteProfile(final String iccid, final Promise promise) {

        Thread r = new Thread() {

            @Override
            public void run() {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - deleteProfile - running");
                }

                lock.lock();

                try {
                    LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), getDefaultRspServerUrl());
                    String result = localProfileAssistant.deleteProfile(iccid, new Progress());

                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - deleteProfile - invoked deleteProfile with result: " + result);
                    }

                    promise.resolve("DELETE COMPLETED");
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);

                    promise.reject(ex);
                } finally {
                    unlock();
                }
            }
        };

        r.start();
    }

    @ReactMethod
    public void enableProfile(final String iccid, final Promise promise) {

        Thread r = new Thread() {

            @Override
            public void run() {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - enableProfile - running");
                }

                try {
                    lock.lock();

                    LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), getDefaultRspServerUrl());
                    String result = localProfileAssistant.enableProfile(iccid, new Progress());

                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - enableProfile - invoked enableProfile with result: " + result);
                    }

                    promise.resolve("ENABLE COMPLETED");
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);

                    promise.reject(ex);
                } finally {
                    unlock();
                }
            }
        };

        r.start();
    }

    @ReactMethod
    public void disableProfile(final String iccid, final Promise promise) {

        final Thread r = new Thread() {

            @Override
            public void run() {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - disableProfile - running");
                }

                try {
                    lock.lock();

                    LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), getDefaultRspServerUrl());
                    String result = localProfileAssistant.disableProfile(iccid, new Progress());

                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - disableProfile - invoked disableProfile with result: " + result);
                    }

                    promise.resolve("DISABLE COMPLETED");
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);

                    promise.reject(ex);
                } finally {
                    unlock();
                }
            }
        };

        r.start();
    }

    @ReactMethod
    public void listProfiles(final Promise promise) {

        Thread r = new Thread() {

            @Override
            public void run() {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - listProfiles - running");
                }

                try {
                    lock.lock();

                    LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), getDefaultRspServerUrl());
                    List<Map<String, String>> response = localProfileAssistant.getProfiles();

                    if (BuildConfig.IS_DEBUG) {
                        Log.d(BuildConfig.TAG, "RNRspEs29Module - listProfiles - response: " + response);
                    }

                    WritableArray writableArray = getWritableArray(response);

                    promise.resolve(writableArray);
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);

                    promise.reject(ex);
                } finally {
                    unlock();
                }

                processPendingNotifications();
            }

            private WritableArray getWritableArray
                    (List<Map<String, String>> response) {
                WritableArray writableArray = Arguments.createArray();

                for (Map<String, String> map : response) {
                    WritableMap writableMap = Arguments.createMap();

                    for (Map.Entry<String, String> entry : map.entrySet()) {
                        writableMap.putString(entry.getKey(), entry.getValue());
                    }

                    writableArray.pushMap(writableMap);
                }


                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - getWritableArray - returning: " + writableArray);
                }

                return writableArray;
            }
        };

        r.start();
    }

    public void processPendingNotifications() {

        Thread r = new Thread() {

            @Override
            public void run() {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "RNRspEs29Module - processPendingNotifications - running");
                }

                try {
                    if (lock.tryLock() && checkNetwork(reactContext) && isSimReady(reactContext)) {
                        LocalProfileAssistantImpl localProfileAssistant = new LocalProfileAssistantImpl(new ApduChannelImpl(reactContext), getDefaultRspServerUrl());

                        localProfileAssistant.processPendingNotifications();

                        if (BuildConfig.IS_DEBUG) {
                            Log.d(BuildConfig.TAG, "RNRspEs29Module - processPendingNotifications - returning:");
                        }
                    } else {
                        if (BuildConfig.IS_DEBUG) {
                            Log.d(BuildConfig.TAG, "RNRspEs29Module - processPendingNotifications - already running. Skipping");
                        }
                    }
                } catch (Exception ex) {
                    Log.e(BuildConfig.TAG, ex.getMessage(), ex);
                } finally {
                    unlock();
                }
            }
        };

        r.start();
    }

    private boolean isSimReady(ReactApplicationContext reactApplicationContext) {
        TelephonyManager telephonyManager = (TelephonyManager) reactApplicationContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);

        return telephonyManager.getSimState() == TelephonyManager.SIM_STATE_READY;
    }

    private boolean checkNetwork(ReactApplicationContext reactApplicationContext) {
        ConnectivityManager connectivityManager = (ConnectivityManager) reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();

        if (networkInfo != null && BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "SimStateModule - is Network Available? " + networkInfo.isAvailable());
        }

        return networkInfo != null && networkInfo.isConnected();
    }
}
