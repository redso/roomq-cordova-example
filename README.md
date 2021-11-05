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

## Installation

1. Clone the roomq-cordova-example repository right next to your Cordova application folder.
2. Go to your application folder, create your Cordova Project and import the plugin to the project.

   ```jsx
   cordova plugin add ../roomq-cordova-example/plugins/cordova-plugin-roomq
   ```

3. If you use Swift to write the binding for iOS, you may need to add `cordova-plugin-add-swift-support` to your project.

   ```bash
   cordova plugin add cordova-plugin-add-swift-support
   ```

4. After you add the plugins, you will see them in package.json on project root folder.

   ```bash
   "devDependencies": {
       ...
       "cordova-plugin-add-swift-support": "^2.0.2",
       "cordova-plugin-roomqplugin": "file:../roomq-cordova-example/plugins/cordova-plugin-roomq"
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

5. Make sure you have your AppTheme in `styles.xml` and colour constants in `colors.xml` in your android, and have already configure your `config.xml` to include those files into your Cordova-Android and define the languages used in different platforms.

   You can create a xml folder in the project directory to include all the required xml resources

   ```bash
   mkdir android_xml
   cd android_xml
   touch styles.xml
   touch colors.xml
   ```

   Implement the styles.xml

   ```xml
   <resources>
   	<!-- Base application theme. -->
   	<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
       	<!-- Customize your theme here. -->
       	<item name="colorPrimary">@color/colorPrimary</item>
       	<item name="colorPrimaryDark">@color/colorPrimaryDark</item>
       	<item name="colorAccent">@color/colorAccent</item>
   	</style>
   </resources>
   ```

   Implement the colors.xml

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <resources>
   		<!-- Customize your color resources here. -->
       <color name="colorPrimary">#FFBB86FC</color>
       <color name="colorPrimaryDark">#FF6200EE</color>
       <color name="colorAccent">#FF3700B3</color>
   </resources>
   ```

   To include both resources into your android platform, your config.xml will have the following code.

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
   </platform>
   ```

## Troubleshoot

- If you encounter Unsupported Swift Version popup from Xcode to suggest you to use Xcode 10.1 to migrate the code to Swift 4, you have to set the Swift Language Version to Swift 5 in Build Settings for your project targets.
