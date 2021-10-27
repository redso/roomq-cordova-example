# Cordova

## Prerequisite

- Environment
  - iOS 9.0+
  - Xcode 11.5+
  - Swift 5.0+
  - Android 4.4+
  - Cordova 10.0+
- RoomQ framework
- RoomQ aar file
- Client ID, to be provided by RoomQ

## How to integrate with RoomQ framework and aar files

1. Create a RoomQ plugin

   ```bash
   ## Create plugin folder
   mkdir <RoomQPluginFolderName>
   cd <RoomQPluginFolderName>
   npm init
   touch plugin.xml

   ## Create www folder
   mkdir www
   touch www/<RoomPluginName>.js

   ## Create src folder
   mkdir src
   mkdir src/ios
   mkdir src/android
   touch src/ios/<RoomPluginName>.swift
   touch src/android/<RoomPluginName>.kt
   touch src/android/<RoomPluginName>.gradle

   ## Create libs folder
   mkdir libs
   ```

1. Place all the RoomQ SDK (aar and framework) into `libs` folder
1. Android RoomQ SDK requires kotlin and AndroidX support. To integrate with Android RoomQ SDK, copy the following contents to `src/android/<RoomPluginName>.gradle` to include all the dependencies.

   ```jsx
   repositories{
     jcenter()
     flatDir {
         dirs 'libs'
      }
   }

   dependencies {
     implementation(name:'roomq-debug', ext:'aar')
     implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.4.0'
     implementation 'com.github.kittinunf.fuel:fuel:2.3.0'
     implementation 'com.github.kittinunf.fuel:fuel-android:2.3.0'
     implementation 'com.github.kittinunf.fuel:fuel-gson:2.3.0'
     implementation 'com.github.kittinunf.fuel:fuel-coroutines:2.3.0'
     implementation 'com.google.code.gson:gson:2.8.6'
     implementation 'androidx.appcompat:appcompat:1.1.0'
     implementation 'androidx.core:core-ktx:1.2.0'
     implementation 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.3.72'
   }

   android {
     packagingOptions {
       exclude 'META-INF/NOTICE'
       exclude 'META-INF/LICENSE'
     }
   }
   ```

1. Build Kotlin bindings for Android SDK

   The following shows a sample of `src/android/<RoomPluginName>.kt`. You might extend this sample to your application.

   ```jsx
   package hk.noq.cordova.plugin;

   // Cordova-required packages
   import org.apache.cordova.CallbackContext;
   import org.apache.cordova.CordovaPlugin;
   import org.apache.cordova.PluginResult;
   import org.apache.cordova.PermissionHelper;
   import org.json.JSONArray;
   import org.json.JSONException;
   import org.json.JSONObject;

   // Android packages
   import android.Manifest;
   import android.app.Activity;
   import android.content.Intent;
   import android.os.Bundle;
   import android.util.Log;
   import android.content.pm.PackageManager;

   import android.content.Context;

   // RoomQ SDK
   import hk.noq.roomq.*
   import hk.noq.roomq.model.*

   class RoomQPlugin : CordovaPlugin() {
     lateinit var callbackContext: CallbackContext;
     lateinit var roomQ: RoomQ;
     lateinit var waitingRoomIntent: Intent;

     companion object {
       protected val LOG_TAG = "RoomQ Plugin";
       protected val INTERNET = Manifest.permission.INTERNET;
       protected val REQUEST_WAITING_ROOM = 0;
     }

     override fun execute(action: String, data: JSONArray, callbackContext: CallbackContext): Boolean {
       this.callbackContext = callbackContext;

       var result = true;
       try {
         when (action) {
           "initRoomQ" -> {
             var clientID = data.getString(0);
             this.initRoomQ(clientID);
           }
           "enqueue" -> this.enqueue();
           "getExpiryTime" -> this.getExpiryTime();
           "extendSession" -> {
             var minutes = data.getInt(0);
             this.extendSession(minutes);
           }
           "deleteSession" -> this.deleteSession();
           "setClientToken" -> {
             var token = data.getString(0);
             this.setClientToken(token);
           }
           else -> {
             handleError("Invalid action");
             result = false;
           }
         }
       } catch (e: Exception) {
         handleException(e);
         result = false;
       }
       return result;
     }

     override fun onRestoreStateForActivityResult(state: Bundle, callbackContext: CallbackContext) {
       this.callbackContext = callbackContext;
     }

     private fun initRoomQ(clientID: String) {
       roomQ = RoomQ(clientID);
       callbackContext.success();
     }

     private fun enqueue() {
       roomQ.enqueue(getContext()) { result ->
         //Place the conditional handling logic here
       }
     }

     private fun getExpiryTime() {
       roomQ.getExpiryTime(getContext()) { response ->
         //Place the conditional handling logic here
       }
     }

     private fun extendSession(minutes: Int) {
       roomQ.extendSession(getContext(), minutes) { response ->
         //Place the conditional handling logic here
       }
     }

     private fun deleteSession() {
       roomQ.deleteSession(getContext()) { response ->
         //Place the conditional handling logic here
       }
     }

     private fun setClientToken(token: String) {
       roomQ.setToken(this.getContext(), token)
     }

     private fun getContext(): Context {
       return cordova.getActivity().getApplicationContext()
     }
   }
   ```

To open the waiting room activity, you need to add the following contents to `src/android/<RoomPluginName>.kt`

```jsx
private fun openWaitingRoomActivity() {
  cordova.setActivityResultCallback(this);
  cordova.startActivityForResult(this, waitingRoomIntent, REQUEST_WAITING_ROOM);
}

override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
  if (requestCode == REQUEST_WAITING_ROOM) {
    if (resultCode == Activity.RESULT_OK && intent != null) {
      val token = intent.getStringExtra(RoomQ.TOKEN);
      Log.d(LOG_TAG, "enter normal flow");
      Log.d(LOG_TAG, token);
    }
  }
}
```

1.  Build Swift bindings for iOS SDK

    The following shows an example of the implementation of `src/ios/<RoomPluginName>.swift`.

    ```jsx
    import Foundation
    import roomq

    @objc(RoomQPlugin) class RoomQPlugin: CDVPlugin {
      var roomq: RoomQ!

      @objc(initRoomQ:)
      func initRoomQ(command: CDVInvokedUrlCommand) {
        NSLog("RoomQPlugin#initRoomQ()")
        //Place your logic here
      }

      @objc(enqueue:)
      func enqueue(command: CDVInvokedUrlCommand) {
        NSLog("RoomQPlugin#enqueue()")
    		//Place your logic here
      }

      @objc(setClientToken:)
      func setClientToken(command: CDVInvokedUrlCommand) {
        NSLog("RoomQPlugin#setClientToken()")
        //Place your logic here
      }

      @objc(getExpiryTime:)
      func getExpiryTime(command: CDVInvokedUrlCommand) {
        NSLog("RoomQPlugin#getExpiryTime()")
        //Place your logic here//Place your logic here
      }

      @objc(extendSession:)
      func extendSession(command: CDVInvokedUrlCommand) {
        NSLog("RoomQPlugin#extendSession()")
        //Place your logic here
      }

      @objc(deleteSession:)
      func deleteSession(command: CDVInvokedUrlCommand) {
        NSLog("RoomQPlugin#deleteSession()")
        //Place your logic here
      }
    	...
    }
    ```

    To present the waiting room view controller, you can call viewController.present method

    ```jsx
    func showWaitingRoom(_ vc: UIViewController) {
      viewController.present(vc, animated: true, completion: nil)
    }
    ```

1.  After setting up the native side bindings, you need to specify the bindings in `plugin.xml` file as shown below.

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
            xmlns:android="http://schemas.android.com/apk/res/android"
            id="cordova-plugin-roomq" version="0.0.1">

      <name>RoomQPlugin</name>

      <description>An Android Cordova plugin that allows users to integrate with RoomQ SDK</description>

      <license>MIT</license>

      <keywords>cordova,android,ios,roomq</keywords>

      <engines>
        <engine name="cordova" version=">=3.0.0"/>
        <engine name="cordova-android" version=">=7.0.0"/>
      </engines>

      <js-module src="www/roomqplugin.js" name="roomqPlugin">
        <clobbers target="window.plugins.roomqPlugin"/>
      </js-module>

      <platform name="android">
        <!-- Permission notes -->
        <uses-permission android:name="android.permission.INTERNET" />

        <!-- Android Resources -->
        <config-file target="res/xml/config.xml" parent="/*">
          <feature name="RoomQPlugin">
            <param name="android-package" value="hk.noq.cordova.plugin.RoomQPlugin"/>
          </feature>
        </config-file>

        <config-file target="res/values/strings.xml" parent="/*">
          <string name="roomq_waiting_room_name">RoomQ Waiting Room</string>
        </config-file>

        <config-file target="AndroidManifest.xml" parent="/manifest/application">
          <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/roomq_waiting_room_name"
            android:launchMode="singleTop"
            android:name="WaitingRoomActivity"
            android:theme="@android:style/Theme.DeviceDefault.NoActionBar"
            android:windowSoftInputMode="adjustResize"
          >
            <intent-filter android:label="@string/launcher_name">
              <action android:name="android.intent.action.MAIN" />
              <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
          </activity>
        </config-file>

        <!-- Project source files -->
        <source-file src="src/android/RoomQPlugin.kt" target-dir="app/src/main/kotlin/hk/noq/cordova/plugin"/>

        <!-- Android shared dependencies -->
        <framework src="src/android/RoomQPlugin.gradle" custom="true" type="gradleReference" />

        <!-- RoomQ library -->
        <lib-file src="libs/roomq-debug.aar" />
        <resource-file src="libs/roomq-debug.aar" target="../../libs/roomq-debug.aar" />
      </platform>

      <platform name="ios">

        <config-file target="config.xml" parent="/*" >
          <feature name="RoomQPlugin">
            <param name="ios-package" value="RoomQPlugin" />
          </feature>
        </config-file>

        <!-- Project source files -->
        <source-file src="src/ios/RoomQPlugin.swift"/>

        <!-- RoomQ library -->
        <framework src="libs/roomq.xcframework" custom="true" embed="true" />
      </platform>
    </plugin>
    ```

    Two `feature` elements define RoomQPlugin as Android and iOS service name. The service name will be used later for JavaScript interface to call with. You also need to include the RoomQ SDK so that the RoomQPlugin in two platform can call it. You can also assigns platform-specific source code and configurations (like permissions) that be included to the project here. To learn more about how to config the `plugin.xml` file, check out [here](https://cordova.apache.org/docs/en/10.x/plugin_ref/spec.html).

1.  Build the JavaScript bindings to native side

    The following shows you how to make bindings between JavaScript and native code with `www/<RoomQPluginName>.js`

    ```jsx
    var exec = cordova.require("cordova/exec");

    var ROOMQ_PLUGIN_NAME = "RoomQPlugin";

    function RoomQPlugin() {
    	...
    }

    //Here to define js function to interact with JAVA module by calling cordova.exec
    RoomQPlugin.prototype.initRoomQ = function (
      clientID,
      successCallback,
      errorCallback
    ) {
      initInProgress = true;

      exec(
        function (result) {
    			...
          successCallback(result);
        },
        function (error) {
    			...
          errorCallback(error);
        },
        ROOMQ_PLUGIN_NAME,
        "initRoomQ",
        [clientID]
      );
    };

    ...

    var roomq = new RoomQPlugin();
    module.exports = roomq;
    ```

    `cordova.exec` method allow you to make requests from the Cordova WebView to the Android/iOS native side.

    ```jsx
    exec(<successFunction>, <failFunction>, <service>, <action>, [<args>]);
    ```

1.  Create your Cordova Project and import the plugin to the project.

    ```jsx
    cordova plugin add ../<RoomQPluginFolderName>
    ```

1.  If you use Swift to write the binding for iOS, you may need to add `cordova-plugin-add-swift-support` to your project.

    ```bash
    cordova plugin add cordova-plugin-add-swift-support
    ```

1.  After you add the plugins, you will see them in package.json on project root folder.

    ```bash
    "devDependencies": {
        ...
        "cordova-plugin-add-swift-support": "^2.0.2",
        "cordova-plugin-roomqplugin": "file:../RoomQPlugin"
      },
      "cordova": {
        "plugins": {
          "cordova-plugin-roomq": {},
          "cordova-plugin-add-swift-support": {}
        },
        "platforms": [
          "ios",
          "android"
        ]
      }
    ```

1.  Make sure you have your AppTheme in `styles.xml` and colour constants in `colors.xml` in your android, and have already configure your `config.xml` to include those files into your Cordova-Android and define the languages used in different platforms.
    `styles.xml`
    `xml <resources> <!-- Base application theme. --> <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar"> <!-- Customize your theme here. --> <item name="colorPrimary">@color/colorPrimary</item> <item name="colorPrimaryDark">@color/colorPrimaryDark</item> <item name="colorAccent">@color/colorAccent</item> </style> </resources> `

            `colors.xml` for example

            ```xml
            <?xml version="1.0" encoding="utf-8"?>
            <resources>
            		<!-- Customize your color resources here. -->
                <color name="colorPrimary">#FFBB86FC</color>
                <color name="colorPrimaryDark">#FF6200EE</color>
                <color name="colorAccent">#FF3700B3</color>
            </resources>
            ```

            `config.xml`

            ```xml
            <platform name="android" kotlin="1.3.50">
                <allow-intent href="market:*" />
                <preference name="GradlePluginKotlinEnabled" value="true" />
                <preference name="GradlePluginKotlinCodeStyle" value="official" />
                <preference name="GradlePluginKotlinVersion" value="1.3.50" />
                <preference name="AndroidXEnabled" value="true" />
                <resource-file src="./android_xml/styles.xml" target="app/src/main/res/values/styles.xml" />
                <resource-file src="./android_xml/colors.xml" target="app/src/main/res/values/colors.xml" />
            </platform>
            <platform name="ios">
                <allow-intent href="itms:*" />
                <allow-intent href="itms-apps:*" />
                <preference name="UseSwiftLanguageVersion" value="5" />
            </platform>
            ```

    If you encounter Unsupported Swift Version popup from Xcode to suggest you to use Xcode 10.1 to migrate the code to Swift 4, you have to set the Swift Language Version to Swift 5 in Build Settings for your plugin targets.
