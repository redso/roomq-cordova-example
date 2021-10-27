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
    try {
      roomQ.enqueue(getContext()) { result ->
        when (result) {
          is EnqueueResult.Wait -> {
            waitingRoomIntent = result.intent;
            openWaitingRoomActivity();
            callbackContext.success();
          }
          is EnqueueResult.Enter -> {
            Log.d(LOG_TAG, "enter normal flow");
            callbackContext.success();
          }
          is EnqueueResult.Error -> {
            Log.d(LOG_TAG, "enter normal flow");
            callbackContext.success()
          }
        }
      }
    } catch (error: Error) {

    }

  }

  private fun getExpiryTime() {
    roomQ.getExpiryTime(getContext()) { response ->
      when (response) {
        is GetExpiryTimeResult.Success -> {
          Log.d(LOG_TAG, "case 1: if the session is still valid, it will return the deadline via response.deadline");
          callbackContext.success()
        }
        GetExpiryTimeResult.Expired -> {
          Log.d(LOG_TAG, "case 2: the session is already expired before extension, to proceed to waiting room, please call enqueue again");
          callbackContext.success()
        }
        GetExpiryTimeResult.NoToken -> {
          Log.d(LOG_TAG, "case 3: no token obtained before");
          callbackContext.success()
        }
        is GetExpiryTimeResult.Error -> {
          Log.d(LOG_TAG, "case 4: Error occur in SDK");
          handleError("Error occur in SDK")
        }
      }
    }
  }

  private fun extendSession(minutes: Int) {
    roomQ.extendSession(getContext(), minutes) { response ->
      when (response) {
        ExtendSessionResponse.EXTENDED -> {
          Log.d(LOG_TAG, "case 1: the session is extended successfully");
          callbackContext.success()
        }
        ExtendSessionResponse.EXPIRED -> {
          Log.d(LOG_TAG, "case 2: the session is already expired before extension, to proceed to waiting room, please call enqueue again");
          callbackContext.success()
        }
        ExtendSessionResponse.SERVER_ERROR -> {
          Log.d(LOG_TAG, "case 3: Error occur in SDK");
          handleError("Error occur in SDK")
        }
      }
    }
  }

  private fun deleteSession() {
    roomQ.deleteSession(getContext()) { response ->
      when (response) {
        DeleteSessionResponse.SUCCESS -> {
          Log.d(LOG_TAG, "case 1: the session is deleted successfully");
          callbackContext.success()
        }
        DeleteSessionResponse.SERVER_ERROR -> {
          Log.d(LOG_TAG, "case 2: Error occur in SDK");
          handleError("Error occur in SDK")
        }
      }
    }
  }

  private fun setClientToken(token: String) {
    roomQ.setToken(this.getContext(), token)
  }

  private fun getContext(): Context {
    return cordova.getActivity().getApplicationContext()
  }

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

  private fun handleError(errorMsg: String) {
    try {
      Log.e(LOG_TAG, errorMsg);
      callbackContext.error(errorMsg);
    } catch (e: Exception) {
      Log.e(LOG_TAG, e.toString());
    }
  }

  private fun handleException(exception: Exception) {
    handleError(exception.toString());
  }
}
