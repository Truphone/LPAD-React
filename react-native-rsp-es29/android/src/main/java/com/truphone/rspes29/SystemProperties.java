package com.truphone.rspes29;

import android.os.Environment;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

public class SystemProperties {
    private static final String PROPERTIES_FILE = "/.gemini";

    public String getPropertyValue(String property) {
        File file = new File(Environment.getExternalStorageDirectory().getPath() + PROPERTIES_FILE);
        String propertyValue = null;

        if (!file.exists()) {
            Log.i(BuildConfig.TAG, "File .gemini does not exist in " + Environment.getExternalStorageDirectory().getPath());
        } else {
            try {
                Properties fileProperties = loadProperties(file);

                propertyValue = fileProperties.getProperty(property, "");
            } catch (Exception e) {
                Log.w(BuildConfig.TAG, e.getMessage(), e);
            }
        }

        if (BuildConfig.IS_DEBUG) {
            Log.d(BuildConfig.TAG, "SystemProperties - getPropertyValue - read from file - property: " + property + " value: " + propertyValue);
        }

        return propertyValue;
    }

    private Properties loadProperties(File file) throws IOException {
        Properties p = new Properties();
        BufferedReader reader = new BufferedReader(new FileReader(file));

        try {
            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "SystemProperties - getPropertyValue - Loading properties");
            }

            p.load(reader);

            if (BuildConfig.IS_DEBUG) {
                Log.d(BuildConfig.TAG, "SystemProperties - getPropertyValue - Properties Loaded");
            }
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException ignored) {
                }
            }
        }

        return p;
    }
}
