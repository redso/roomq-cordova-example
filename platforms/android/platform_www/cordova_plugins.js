cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-roomq.roomqPlugin",
      "file": "plugins/cordova-plugin-roomq/www/roomqplugin.js",
      "pluginId": "cordova-plugin-roomq",
      "clobbers": [
        "window.plugins.roomqPlugin"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-add-swift-support": "2.0.2",
    "cordova-plugin-roomq": "0.0.1"
  };
});