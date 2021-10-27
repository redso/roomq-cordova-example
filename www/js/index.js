var app = {
  onDeviceReady: function () {
    console.log(
      "Running cordova-" + cordova.platformId + "@" + cordova.version
    );
    document.getElementById("deviceready").classList.add("ready");
    const roomqPlugin = window.plugins.roomqPlugin;
    const clientID = "enicorn-demo";
    roomqPlugin.initRoomQ(
      clientID,
      (result) => {
        console.log("Success");
        console.log(result);
        document.getElementById("enqueue-button").addEventListener(
          "click",
          () => {
            roomqPlugin.enqueue(
              (response) => {
                console.log("Success call enqueue");
              },
              (error) => {
                console.log("Failure call enqueue");
              }
            );
          },
          false
        );

        document.getElementById("get-expiry-time-button").addEventListener(
          "click",
          () => {
            roomqPlugin.getExpiryTime(
              (response) => {
                console.log("Success call getExpiryTime");
              },
              (error) => {
                console.log("Failure call getExpiryTime");
              }
            );
          },
          false
        );

        document.getElementById("extend-session-button").addEventListener(
          "click",
          () => {
            roomqPlugin.extendSession(
              5,
              (response) => {
                console.log("Success call extendSession");
              },
              (error) => {
                console.log("Failure call extendSession");
              }
            );
          },
          false
        );

        document.getElementById("delete-session-button").addEventListener(
          "click",
          () => {
            roomqPlugin.deleteSession(
              (response) => {
                console.log("Success call deleteSession");
              },
              (error) => {
                console.log("Failure call deleteSession");
              }
            );
          },
          false
        );
      },
      (error) => {
        console.log("Failure");
        console.log(error);
      }
    );
  },
  bindEvents: function () {
    document.addEventListener("deviceready", this.onDeviceReady, false);
  },
  initialize: function () {
    this.bindEvents();
  },
};

app.initialize();
