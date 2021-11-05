var exec = cordova.require("cordova/exec");

var hasInitialized = false;
var initInProgress = false;

var ROOMQ_PLUGIN_NAME = "RoomQPlugin";

function RoomQPlugin() {}

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

      exec(
        function (result1) {
          successCallback(result1);
        },
        function (error1) {
          console.log(JSON.stringify(error1));
          errorCallback(error1);
        },
        ROOMQ_PLUGIN_NAME,
        "enqueue",
        []
      );
    },
    function (error) {
      initInProgress = false;
      console.log(JSON.stringify(error));
      errorCallback(error);
    },
    ROOMQ_PLUGIN_NAME,
    "initRoomQ",
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
    "enqueue",
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
    "getExpiryTime",
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
    "extendSession",
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
    "deleteSession",
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
    "setClientToken",
    [token]
  );
};

var roomq = new RoomQPlugin();
module.exports = roomq;
