package com.truphone.gemini;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.truphone.rspes29.RNRspEs29Module;

public class SimStateModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private static final String READY = "LOADED";

    private final BroadcastReceiver simStateChangedReceiver;
    private final RNRspEs29Module rnRspEs29Module;
    private final BroadcastReceiver networkStateChangedReceiver;

    public SimStateModule(ReactApplicationContext reactContext) {

        super(reactContext);

        final ReactApplicationContext ctx = reactContext;
        rnRspEs29Module = new RNRspEs29Module(reactContext);
        simStateChangedReceiver = createSimStateChangeListener(ctx);
        networkStateChangedReceiver = createNetworkStateChangeListener(ctx);

        ctx.addLifecycleEventListener(this);
    }

    private BroadcastReceiver createNetworkStateChangeListener(final ReactApplicationContext ctx) {

        return new BroadcastReceiver() {

            @Override
            public void onReceive(Context context, Intent intent) {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "SimStateModule - Network connectivity change");
                    Log.d(BuildConfig.TAG, "SimStateModule - Network connectivity change - Intent: " + intent.toUri(0));
                }

                processNotifications(ctx, "Network connectivity change");
            }
        };
    }

    private void processNotifications(ReactApplicationContext reactApplicationContext, String change) {

        if (hasNetwork(reactApplicationContext) && isSimReady(reactApplicationContext)) {
            try {
                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "Network is Available AND Sim State is READY. Processing Pending Notifications (" + change + ")");
                }

                rnRspEs29Module.processPendingNotifications();
            } catch (Exception e) {
                Log.w(BuildConfig.TAG, "(" + change + ") - " + e.getMessage(), e);
            }
        }
    }

    private boolean isSimReady(ReactApplicationContext reactApplicationContext) {
        TelephonyManager tm = (TelephonyManager) reactApplicationContext.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);

        return tm.getSimState() == TelephonyManager.SIM_STATE_READY;
    }

    private boolean hasNetwork(ReactApplicationContext reactApplicationContext) {
        ConnectivityManager connectivityManager = (ConnectivityManager) reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();

        if (networkInfo != null && BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "SimStateModule - is Network Available? " + networkInfo.isAvailable());
        }

        return networkInfo != null && networkInfo.isConnected();
    }

    private void sendSimReady(ReactApplicationContext reactApplicationContext) {

        if (isSimReady(reactApplicationContext)) {
            WritableMap map = Arguments.createMap();

            map.putString("simState", READY);

            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "SimStateModule - Emitting SIM_READY event.");
            }

            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("SIM_READY", map);
        }
    }

    private BroadcastReceiver createSimStateChangeListener(final ReactApplicationContext reactApplicationContext) {

        return new BroadcastReceiver() {

            @Override
            public void onReceive(Context context, Intent intent) {

                if (BuildConfig.IS_DEBUG) {
                    Log.d(BuildConfig.TAG, "SimStateModule - SIM STATE CHANGED");
                    Log.d(BuildConfig.TAG, "SimStateModule - SIM State change - Intent: " + intent.toUri(0));
                }

                String simState = intent.getExtras().getString("ss");

                if (READY.equals(simState)) {
                    sendSimReady(reactApplicationContext);
                    processNotifications(reactApplicationContext, "SIM State change");
                }
            }
        };
    }

    @Override
    public String getName() {

        return "SimState";
    }

    @Override
    public void onHostResume() {
        final Activity activity = getCurrentActivity();

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "SimStateModule - onHostResume");
        }

        if (activity == null) {
            FLog.e(ReactConstants.TAG, "no activity to register simStateChangedReceiver");

            return;
        }

        addChangeReceiver(activity, "android.intent.action.SIM_STATE_CHANGED", simStateChangedReceiver);
        addChangeReceiver(activity, "android.net.conn.CONNECTIVITY_CHANGE", networkStateChangedReceiver);
    }

    private void addChangeReceiver(Activity activity, String action, BroadcastReceiver changeReceiver) {
        IntentFilter filter = new IntentFilter();

        filter.addAction(action);
        activity.registerReceiver(changeReceiver, filter);
    }

    @Override
    public void onHostPause() {
        final Activity activity = getCurrentActivity();

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "SimStateModule - onHostPause");
        }

        if (activity == null) {
            return;
        }

        try {
            activity.unregisterReceiver(simStateChangedReceiver);
            activity.unregisterReceiver(networkStateChangedReceiver);
        } catch (java.lang.IllegalArgumentException e) {
            FLog.e(ReactConstants.TAG, "simStateChangedReceiver already unregistered", e);
        }
    }

    @Override
    public void onHostDestroy() {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "SimStateModule - onHostDestroy");
        }
    }
}


