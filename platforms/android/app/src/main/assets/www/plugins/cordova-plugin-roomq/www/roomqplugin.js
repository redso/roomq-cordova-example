cordova.define("cordova-plugin-roomq.roomqPlugin", function(require, exports, module) {
var exec = cordova.require("cordova/exec");

var hasInitialized = false;
var initInProgress = false;

var ROOMQ_PLUGIN_NAME = "RoomQPlugin";

function RoomQPlugin() {
  // The value will be passed as a first argument into execute function in Andorid and as a function name in iOS.
  this.actionTypes = {
    INIT: "initRoomQ",
    ENQUEUE: "enqueue",
    GET_EXPIRY_TIME: "getExpiryTime",
    EXTEND_SESSION: "extendSession",
    DELETE_SESSION: "deleteSession",
    SET_TOKEN: "setClientToken",
  };
}

//Here to define js function to interact with JAVA module by calling cordova.exec
RoomQPlugin.prototype.initRoomQ = function (
  clientID,
  successCallback,
  errorCallback
) {
  if (typeof clientID != "string") {
    console.log(
      "RoomQPlugin.initRoomQ failure: clientID parameter not a string."
    );
    return;
  }

  if (typeof successCallback != "function") {
    console.log(
      "RoomQPlugin.initRoomQ failure: success callback parameter must be a function."
    );
    return;
  }

  if (typeof errorCallback != "function") {
    console.log(
      "RoomQPlugin.initRoomQ failure: failure callback parameter must be a function."
    );
    return;
  }

  if (initInProgress) {
    errorCallback("Init RoomQ is already in progress");
  }

  if (hasInitialized) {
    console.log("RoomQPlugin.initRoomQ: RoomQ is already initialized.");
    return;
  }

  initInProgress = true;

  exec(
    function (result) {
      initInProgress = false;
      hasInitialized = true;
      console.log(result);
      successCallback(result);
    },
    function (error) {
      initInProgress = false;
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    this.actionTypes.INIT,
    [clientID]
  );
};

RoomQPlugin.prototype.enqueue = function (successCallback, errorCallback) {
  if (initInProgress || !hasInitialized) {
    errorCallback("RoomQ is being initialized");
  }
  exec(
    function (result) {
      successCallback(result);
    },
    function (error) {
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    this.actionTypes.ENQUEUE,
    []
  );
};

RoomQPlugin.prototype.getExpiryTime = function (
  successCallback,
  errorCallback
) {
  if (initInProgress || !hasInitialized) {
    errorCallback("RoomQ is being initialized");
  }
  exec(
    function (result) {
      successCallback(result);
    },
    function (error) {
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    this.actionTypes.GET_EXPIRY_TIME,
    []
  );
};

RoomQPlugin.prototype.extendSession = function (
  minutes,
  successCallback,
  errorCallback
) {
  if (initInProgress || !hasInitialized) {
    errorCallback("RoomQ is being initialized");
  }
  exec(
    function (result) {
      successCallback(result);
    },
    function (error) {
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    this.actionTypes.EXTEND_SESSION,
    [minutes]
  );
};

RoomQPlugin.prototype.deleteSession = function (
  successCallback,
  errorCallback
) {
  if (initInProgress || !hasInitialized) {
    errorCallback("RoomQ is being initialized");
  }
  exec(
    function (result) {
      successCallback(result);
    },
    function (error) {
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    this.actionTypes.DELETE_SESSION,
    []
  );
};

RoomQPlugin.prototype.setClientToken = function (
  token,
  successCallback,
  errorCallback
) {
  if (initInProgress || !hasInitialized) {
    errorCallback("RoomQ is being initialized");
  }
  exec(
    function (result) {
      successCallback(result);
    },
    function (error) {
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    this.actionTypes.SET_TOKEN,
    [token]
  );
};

var roomq = new RoomQPlugin();
module.exports = roomq;

});
