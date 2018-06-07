package com.truphone.gemini;

import android.content.Intent;
import android.content.res.Configuration;
import android.util.Log;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    @Override
    public void onConfigurationChanged(Configuration newConfig) {

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "MainActivity - onConfigurationChanged: " + newConfig);
        }

        super.onConfigurationChanged(newConfig);

        Intent intent = new Intent("onConfigurationChanged");

        intent.putExtra("newConfig", newConfig);

        this.sendBroadcast(intent);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {

        return "gemini";
    }
}
