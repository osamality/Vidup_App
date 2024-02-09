package com.vidupapp;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import org.devio.rn.splashscreen.SplashScreen;


public class MainActivity extends ReactActivity {

     @Override
   public void onConfigurationChanged(Configuration newConfig) {
           super.onConfigurationChanged(newConfig);
           Intent intent = new Intent("onConfigurationChanged");
           intent.putExtra("newConfig", newConfig);
           this.sendBroadcast(intent);
       }

  @Override
  protected String getMainComponentName() {
    return "VidupApp";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState){
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
  }
}
