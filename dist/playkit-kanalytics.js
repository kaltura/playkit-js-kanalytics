(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("playkit-js"));
	else if(typeof define === 'function' && define.amd)
		define(["playkit-js"], factory);
	else if(typeof exports === 'object')
		exports["PlaykitJsKAnalytics"] = factory(require("playkit-js"));
	else
		root["PlaykitJsKAnalytics"] = factory(root["Playkit"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _playkitJs = __webpack_require__(1);

var _statsService = __webpack_require__(2);

var _statsService2 = _interopRequireDefault(_statsService);

var _eventTypes = __webpack_require__(3);

var _eventTypes2 = _interopRequireDefault(_eventTypes);

var _event = __webpack_require__(4);

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pluginName = "kanalytics";

/**
 * Your class description.
 * Your class description.
 * @classdesc
 */

var Kanalytics = function (_BasePlugin) {
  _inherits(Kanalytics, _BasePlugin);

  _createClass(Kanalytics, null, [{
    key: 'isValid',


    /**
     * @static
     * @public
     * @returns {boolean} - Whether the plugin is valid.
     */
    value: function isValid() {
      return true;
    }

    // Stores the last time we issued a seek event
    // avoids sending lots of seeks while scrubbing

    /**
     * @static
     */

  }]);

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player reference.
   * @param {Object} config - The plugin configuration.
   */
  function Kanalytics(name, player, config) {
    _classCallCheck(this, Kanalytics);

    var _this = _possibleConstructorReturn(this, (Kanalytics.__proto__ || Object.getPrototypeOf(Kanalytics)).call(this, name, player, config));

    _this._initializeMembers();
    _this.registerListeners();

    /**
     Now you have access to the BasePlugin members:
     1. config: The runtime configuration of the plugin.
     2. name: The name of the plugin.
     3. logger: The logger of the plugin.
     4. player: Reference to the actual player.
     5. eventManager: The event manager of the plugin.
     */
    return _this;
  }

  /**
   * @public
   * @return {void}
   */


  _createClass(Kanalytics, [{
    key: 'destroy',
    value: function destroy() {
      this._initializeMembers();
      this.eventManager.destroy();
    }
  }, {
    key: 'registerListeners',
    value: function registerListeners() {
      var PlayerEvent = this.player.Event;
      this.eventManager.listen(this.player, PlayerEvent.FIRST_PLAY, this._sendAnalyticsEvent.bind(this, _eventTypes2.default.PLAY));
      this.eventManager.listen(this.player, PlayerEvent.PLAY, this._onPlay.bind(this));
      this.eventManager.listen(this.player, PlayerEvent.ENDED, this._onEnded.bind(this));
      this.eventManager.listen(this.player, PlayerEvent.SEEKED, this._sendSeekEvent.bind(this));
      this.eventManager.listen(this.player, PlayerEvent.TIME_UPDATE, this._sendTimeEvent.bind(this));
    }
  }, {
    key: '_onPlay',
    value: function _onPlay() {
      if (this._ended) {
        this._ended = false;
        this._sendAnalyticsEvent(_eventTypes2.default.REPLAY);
      }
    }
  }, {
    key: '_onEnded',
    value: function _onEnded() {
      this._ended = true;
    }
  }, {
    key: '_sendSeekEvent',
    value: function _sendSeekEvent() {
      if (this._lastSeekEventTime == 0 || this._lastSeekEventTime + 2000 < new Date().getTime()) {
        this._sendAnalyticsEvent(_eventTypes2.default.SEEK);
      }
      this._lastSeekEventTime = new Date().getTime();
      this._hasSeeked = true;
      this._lastSeek = this.player.currentTime;
    }
  }, {
    key: '_sendTimeEvent',
    value: function _sendTimeEvent() {

      var percent = this.player.currentTime / this.player.duration;

      if (!this._playingEventsState.PLAY_REACHED_25 && percent >= .25) {
        this._playingEventsState.PLAY_REACHED_25 = true;
        this._sendAnalyticsEvent(_eventTypes2.default.PLAY_REACHED_25);
      }
      if (!this._playingEventsState.PLAY_REACHED_50 && percent >= .50) {
        this._playingEventsState.PLAY_REACHED_50 = true;
        this._sendAnalyticsEvent(_eventTypes2.default.PLAY_REACHED_50);
      }
      if (!this._playingEventsState.PLAY_REACHED_75 && percent >= .75) {
        this._playingEventsState.PLAY_REACHED_75 = true;
        this._sendAnalyticsEvent(_eventTypes2.default.PLAY_REACHED_75);
      }
      if (!this._playingEventsState.PLAY_REACHED_100 && percent >= .98) {
        this._playingEventsState.PLAY_REACHED_100 = true;
        this._sendAnalyticsEvent(_eventTypes2.default.PLAY_REACHED_100);
      }
    }
  }, {
    key: '_sendAnalyticsEvent',
    value: function _sendAnalyticsEvent(eventType) {
      var _this2 = this;

      var ks = void 0;
      var statsEvent = new _event2.default(eventType);
      statsEvent.clientVer = _playkitJs.VERSION;
      statsEvent.currentPoint = this.player.currentTime;
      statsEvent.duration = this.player.duration;
      var config = this.player.config;
      if (config) {
        statsEvent.entryId = config.id;
        var session = config.session;
        if (session) {
          statsEvent.sessionId = session.id;
          statsEvent.partnerId = session.partnerID;
          statsEvent.widgetId = "_" + session.partnerID;
          statsEvent.uiconfId = session.uiConfID;
          ks = session.ks;
        }
      }
      statsEvent.seek = this._hasSeeked;

      //TODO: set this properties correctly
      statsEvent.contextId = 0;
      statsEvent.featureType = 0;
      statsEvent.applicationId = "";
      statsEvent.userId = 0;

      statsEvent.referrer = document.referrer;

      var request = _statsService2.default.collect(ks, { "event": statsEvent });
      request.doHttpRequest().then(function () {
        _this2.logger.debug('Analitycs event sent', statsEvent);
      }, function (err) {
        _this2.logger.error('Failed to send analitycs event', statsEvent, err);
      });
    }
  }, {
    key: '_initializeMembers',
    value: function _initializeMembers() {
      this._ended = false;
      this._playingEventsState = {};
      this._lastSeekEventTime = 0;
      this._lastSeek = 0;
      this._hasSeeked = false;
      this.PLAY_REACHED_25 = false;
      this.PLAY_REACHED_50 = false;
      this.PLAY_REACHED_75 = false;
      this.PLAY_REACHED_100 = false;
    }
  }]);

  return Kanalytics;
}(_playkitJs.BasePlugin);

/**
 * Register the plugin in the playkit-js plugin framework.
 */


Kanalytics.defaultConfig = {};
exports.default = Kanalytics;
(0, _playkitJs.registerPlugin)(pluginName, Kanalytics);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["PlaykitJsProviders"] = factory();
	else
		root["PlaykitJsProviders"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Request builder
 * @classdesc
 */
var RequestBuilder = function () {

  /**
   * @constructor
   * @param {Map<string, string>} headers The request headers
   */

  /**
   * @member - Service method (POST,GET,DELETE etc..)
   * @type {string}
   */

  /**
   * @member - Service headers
   * @type {Map<string, string>}
   */

  /**
   * @member - Service action
   * @type {string}
   */
  function RequestBuilder() {
    var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();

    _classCallCheck(this, RequestBuilder);

    this.headers = headers;
    this.headers.set("Content-Type", "application/json");
  }

  /**
   * Builds restful service URL
   * @function getUrl
   * @returns {string} The service URL
   */

  /**
   * @member - Service tag
   * @type {string}
   */

  /**
   * @member - Service base url
   * @type {Map<string, string>}
   */

  /**
   * @member - Service params
   * @type {any}
   */


  /**
   * @member - Service name
   * @type {string}
   */


  _createClass(RequestBuilder, [{
    key: "getUrl",
    value: function getUrl() {
      if (!this.baseUrl) {
        throw new Error("baseUrl is mandatory for request builder");
      }
      var url = this.baseUrl + '/service/' + this.service + (this.action ? '/action/' + this.action : '');
      return url;
    }

    /**
     * Executes service
     * @function doHttpRequest
     * @returns {Promise.<any>} Service response as promise
     */

  }, {
    key: "doHttpRequest",
    value: function doHttpRequest() {
      var _this = this;

      var request = new XMLHttpRequest();
      return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              var jsonResponse = JSON.parse(request.responseText);
              if (jsonResponse && (typeof jsonResponse === "undefined" ? "undefined" : _typeof(jsonResponse)) === 'object' && jsonResponse.code && jsonResponse.message) reject(jsonResponse);else resolve(jsonResponse);
            } else {
              reject(request.responseText);
            }
          }
        };
        request.open(_this.method, _this.getUrl());
        _this.headers.forEach(function (value, key) {
          request.setRequestHeader(key, value);
        });
        request.send(_this.params);
      });
    }
  }]);

  return RequestBuilder;
}();

exports.default = RequestBuilder;

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
  beUrl: "http://www.kaltura.com/api_v3",
  baseUrl: "https://cdnapisec.kaltura.com",
  serviceParams: {
    clientTag: "playkit-js",
    apiVersion: '3.3.0',
    format: 1
  }
};

var Configuration = function () {
  function Configuration() {
    _classCallCheck(this, Configuration);
  }

  _createClass(Configuration, null, [{
    key: "set",
    value: function set(clientConfig) {
      if (clientConfig) {
        Object.assign(defaultConfig, clientConfig);
      }
    }
  }, {
    key: "get",
    value: function get() {
      return defaultConfig;
    }
  }]);

  return Configuration;
}();

exports.default = Configuration;
exports.Configuration = Configuration;

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _multiRequestBuilder = __webpack_require__(6);

var _multiRequestBuilder2 = _interopRequireDefault(_multiRequestBuilder);

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = _config2.default.get();
var SERVICE_NAME = "multirequest";

/**
 * Base for all ovp services
 * @classdesc
 */

var OvpService = function () {
  function OvpService() {
    _classCallCheck(this, OvpService);
  }

  _createClass(OvpService, null, [{
    key: 'getMultirequest',

    /**
     * Gets a new instance of MultiRequestBuilder with ovp params
     * @function getMultirequest
     * @param {string} ks The ks
     * @param {string} partnerId The partner ID
     * @returns {MultiRequestBuilder} The multi request builder
     * @static
     */
    value: function getMultirequest(ks, partnerId) {
      var ovpParams = config.serviceParams;
      Object.assign(ovpParams, { ks: ks });
      if (partnerId) {
        Object.assign(ovpParams, { partnerId: partnerId });
      }
      var multiReq = new _multiRequestBuilder2.default();
      multiReq.method = "POST";
      multiReq.service = SERVICE_NAME;
      multiReq.baseUrl = config.beUrl;
      multiReq.params = ovpParams;
      return multiReq;
    }
  }]);

  return OvpService;
}();

exports.default = OvpService;

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestBuilder = exports.Configuration = exports.StatsService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ovpService = __webpack_require__(3);

var _ovpService2 = _interopRequireDefault(_ovpService);

var _requestBuilder = __webpack_require__(0);

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SERVICE_NAME = "stats";
/**
 * Ovp stats service methods
 * @classdesc
 */

var StatsService = function (_OvpService) {
  _inherits(StatsService, _OvpService);

  function StatsService() {
    _classCallCheck(this, StatsService);

    return _possibleConstructorReturn(this, (StatsService.__proto__ || Object.getPrototypeOf(StatsService)).apply(this, arguments));
  }

  _createClass(StatsService, null, [{
    key: 'collect',


    /**
     * Creates an instance of RequestBuilder for stats.collect
     * @function collect
     * @param {string} ks - The ks
     * @param {Object} event - The event data
     * @param {string} [baseUrl=Configuration.beUrl] - The service base URL
     * @returns {RequestBuilder} - The request builder
     * @static
     */
    value: function collect(ks, event, baseUrl) {
      var ovpParams = _config2.default.get();
      var serviceParams = {};
      Object.assign(serviceParams, ovpParams.serviceParams, { ks: ks }, event);
      var request = new _requestBuilder2.default();
      request.service = SERVICE_NAME;
      request.action = "collect";
      request.method = "POST";
      request.baseUrl = baseUrl || ovpParams.beUrl;
      request.tag = "stats-collect";
      request.params = JSON.stringify(serviceParams);
      return request;
    }
  }]);

  return StatsService;
}(_ovpService2.default);

exports.default = StatsService;
exports.StatsService = StatsService;
exports.Configuration = _config2.default;
exports.RequestBuilder = _requestBuilder2.default;

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base service result
 * @classdesc
 */
var ServiceResult =

/**
 * @constructor
 * @param {Object} response - Service response
 */

/**
 * @member - The service error
 * @type {ServiceError}
 */

/**
 * @member - The service result data
 * @type {Object}
 */
function ServiceResult(response) {
  _classCallCheck(this, ServiceResult);

  this.hasError = false;

  if (response.objectType === "KalturaAPIException") {
    this.hasError = true;
    this.error = new ServiceError(response.code, response.message);
  } else {
    this.data = response;
  }
}

/**
 * @member - Is service returned an error
 * @type {boolean}
 */
;

/**
 * Service error
 * @classdesc
 */


exports.default = ServiceResult;

var ServiceError =

/**
 * @constructor
 * @param {string} code - The result code
 * @param {string} message - The result message
 */

/**
 * @member - The error code
 * @type {string}
 */
function ServiceError(code, message) {
  _classCallCheck(this, ServiceError);

  this.code = code;
  this.message = message;
}
/**
 * @member - The error message
 * @type {string}
 */
;

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOG_LEVEL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsLogger = __webpack_require__(8);

var JsLogger = _interopRequireWildcard(_jsLogger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoggerFactory = function () {
  function LoggerFactory(options) {
    _classCallCheck(this, LoggerFactory);

    JsLogger.useDefaults(options || {});
  }

  _createClass(LoggerFactory, [{
    key: "get",
    value: function get(name) {
      if (!name) {
        return JsLogger;
      }
      return JsLogger.get(name);
    }
  }]);

  return LoggerFactory;
}();

var Logger = new LoggerFactory({ defaultLevel: JsLogger.DEBUG });
var LOG_LEVEL = {
  "DEBUG": JsLogger.DEBUG,
  "INFO": JsLogger.INFO,
  "TIME": JsLogger.TIME,
  "WARN": JsLogger.WARN,
  "ERROR": JsLogger.ERROR,
  "OFF": JsLogger.OFF
};

exports.default = Logger;
exports.LOG_LEVEL = LOG_LEVEL;

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiRequestResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestBuilder = __webpack_require__(0);

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

var _baseServiceResult = __webpack_require__(4);

var _baseServiceResult2 = _interopRequireDefault(_baseServiceResult);

var _logger = __webpack_require__(5);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @constant
 */
var logger = _logger2.default.get("OvpProvider");

/**
 * Multi Request builder
 * @classdesc
 */

var MultiRequestBuilder = function (_RequestBuilder) {
  _inherits(MultiRequestBuilder, _RequestBuilder);

  /**
   * @constructor
   */
  function MultiRequestBuilder() {
    _classCallCheck(this, MultiRequestBuilder);

    var _this = _possibleConstructorReturn(this, (MultiRequestBuilder.__proto__ || Object.getPrototypeOf(MultiRequestBuilder)).call(this));

    _this.requests = [];
    return _this;
  }

  /**
   * Adds request to requests array
   * @function add
   * @param {RequestBuilder} request The request
   * @returns {MultiRequestBuilder} The multiRequest
   */


  /**
   * @member - Array of requests
   * @type {Array<RequestBuilder>}
   */


  _createClass(MultiRequestBuilder, [{
    key: 'add',
    value: function add(request) {
      this.requests.push(request);
      var requestParams = {};
      var serviceDef = { service: request.service, action: request.action };
      Object.assign(requestParams, _defineProperty({}, this.requests.length, Object.assign(serviceDef, request.params)));
      Object.assign(requestParams, this.params);
      this.params = requestParams;
      return this;
    }

    /**
     * Executes a multi request
     * @function execute
     * @returns {Promise} The multirequest execution promisie
     */

  }, {
    key: 'execute',
    value: function execute() {
      var _this2 = this;

      try {
        this.params = JSON.stringify(this.params);
      } catch (err) {
        logger.error('' + err.message);
      }
      return new Promise(function (resolve, reject) {
        _this2.doHttpRequest().then(function (data) {
          resolve(new MultiRequestResult(data));
        }, function (err) {
          var errorText = 'Error on multiRequest execution, error <' + err + '>.';
          reject(errorText);
        });
      });
    }
  }]);

  return MultiRequestBuilder;
}(_requestBuilder2.default);

/**
 * Multi Request result object
 * @classdesc
 */


exports.default = MultiRequestBuilder;

var MultiRequestResult =

/**
 * @constructor
 * @param {Object}  response data
 */


/**
 * @member - Is success
 * @type {boolean}
 */
exports.MultiRequestResult = function MultiRequestResult(response) {
  var _this3 = this;

  _classCallCheck(this, MultiRequestResult);

  this.results = [];

  this.success = true;
  response.forEach(function (result) {
    var serviceResult = new _baseServiceResult2.default(result);
    _this3.results.push(serviceResult);
    if (serviceResult.hasError) {
      logger.error('Service returned an error with error code: ' + serviceResult.error.code + ' and message: ' + serviceResult.error.message + '.');
      _this3.success = false;
      return;
    }
  });
}
/**
 * @member - Multi request response data
 * @type {Object}
 */
;

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * js-logger - http://github.com/jonnyreeves/js-logger
 * Jonny Reeves, http://jonnyreeves.co.uk/
 * js-logger may be freely distributed under the MIT license.
 */
(function (global) {
	"use strict";

	// Top level module for the global, static logger instance.
	var Logger = { };

	// For those that are at home that are keeping score.
	Logger.VERSION = "1.3.0";

	// Function which handles all incoming log messages.
	var logHandler;

	// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
	var contextualLoggersByNameMap = {};

	// Polyfill for ES5's Function.bind.
	var bind = function(scope, func) {
		return function() {
			return func.apply(scope, arguments);
		};
	};

	// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
	var merge = function () {
		var args = arguments, target = args[0], key, i;
		for (i = 1; i < args.length; i++) {
			for (key in args[i]) {
				if (!(key in target) && args[i].hasOwnProperty(key)) {
					target[key] = args[i][key];
				}
			}
		}
		return target;
	};

	// Helper to define a logging level object; helps with optimisation.
	var defineLogLevel = function(value, name) {
		return { value: value, name: name };
	};

	// Predefined logging levels.
	Logger.DEBUG = defineLogLevel(1, 'DEBUG');
	Logger.INFO = defineLogLevel(2, 'INFO');
	Logger.TIME = defineLogLevel(3, 'TIME');
	Logger.WARN = defineLogLevel(4, 'WARN');
	Logger.ERROR = defineLogLevel(8, 'ERROR');
	Logger.OFF = defineLogLevel(99, 'OFF');

	// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
	// of each other.
	var ContextualLogger = function(defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  // Convenience alias.
	};

	ContextualLogger.prototype = {
		// Changes the current logging level for the logging instance.
		setLevel: function (newLevel) {
			// Ensure the supplied Level object looks valid.
			if (newLevel && "value" in newLevel) {
				this.context.filterLevel = newLevel;
			}
		},

		// Is the logger configured to output messages at the supplied level?
		enabledFor: function (lvl) {
			var filterLevel = this.context.filterLevel;
			return lvl.value >= filterLevel.value;
		},

		debug: function () {
			this.invoke(Logger.DEBUG, arguments);
		},

		info: function () {
			this.invoke(Logger.INFO, arguments);
		},

		warn: function () {
			this.invoke(Logger.WARN, arguments);
		},

		error: function () {
			this.invoke(Logger.ERROR, arguments);
		},

		time: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'start' ]);
			}
		},

		timeEnd: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'end' ]);
			}
		},

		// Invokes the logger callback if it's not being filtered.
		invoke: function (level, msgArgs) {
			if (logHandler && this.enabledFor(level)) {
				logHandler(msgArgs, merge({ level: level }, this.context));
			}
		}
	};

	// Protected instance which all calls to the to level `Logger` module will be routed through.
	var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

	// Configure the global Logger instance.
	(function() {
		// Shortcut for optimisers.
		var L = Logger;

		L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
		L.debug = bind(globalLogger, globalLogger.debug);
		L.time = bind(globalLogger, globalLogger.time);
		L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
		L.info = bind(globalLogger, globalLogger.info);
		L.warn = bind(globalLogger, globalLogger.warn);
		L.error = bind(globalLogger, globalLogger.error);

		// Don't forget the convenience alias!
		L.log = L.info;
	}());

	// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
	// object with the supplied log messages and the second being a context object which contains a hash of stateful
	// parameters which the logging function can consume.
	Logger.setHandler = function (func) {
		logHandler = func;
	};

	// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
	// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
	Logger.setLevel = function(level) {
		// Set the globalLogger's level.
		globalLogger.setLevel(level);

		// Apply this level to all registered contextual loggers.
		for (var key in contextualLoggersByNameMap) {
			if (contextualLoggersByNameMap.hasOwnProperty(key)) {
				contextualLoggersByNameMap[key].setLevel(level);
			}
		}
	};

	// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
	// default context and log handler.
	Logger.get = function (name) {
		// All logger instances are cached so they can be configured ahead of use.
		return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
	};

	// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
	// write to the window's console object (if present); the optional options object can be used to customise the
	// formatter used to format each log message.
	Logger.createDefaultHandler = function (options) {
		options = options || {};

		options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
			// Prepend the logger's name to the log message for easy identification.
			if (context.name) {
				messages.unshift("[" + context.name + "]");
			}
		};

		// Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
		// that don't offer a native console method.
		var timerStartTimeByLabelMap = {};

		// Support for IE8+ (and other, slightly more sane environments)
		var invokeConsoleMethod = function (hdlr, messages) {
			Function.prototype.apply.call(hdlr, console, messages);
		};

		// Check for the presence of a logger.
		if (typeof console === "undefined") {
			return function () { /* no console */ };
		}

		return function(messages, context) {
			// Convert arguments object to Array.
			messages = Array.prototype.slice.call(messages);

			var hdlr = console.log;
			var timerLabel;

			if (context.level === Logger.TIME) {
				timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

				if (messages[1] === 'start') {
					if (console.time) {
						console.time(timerLabel);
					}
					else {
						timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
					}
				}
				else {
					if (console.timeEnd) {
						console.timeEnd(timerLabel);
					}
					else {
						invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
							(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
					}
				}
			}
			else {
				// Delegate through to custom warn/error loggers if present on the console.
				if (context.level === Logger.WARN && console.warn) {
					hdlr = console.warn;
				} else if (context.level === Logger.ERROR && console.error) {
					hdlr = console.error;
				} else if (context.level === Logger.INFO && console.info) {
					hdlr = console.info;
				}

				options.formatter(messages, context);
				invokeConsoleMethod(hdlr, messages);
			}
		};
	};

	// Configure and example a Default implementation which writes to the `window.console` (if present).  The
	// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
	Logger.useDefaults = function(options) {
		Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
		Logger.setHandler(Logger.createDefaultHandler(options));
	};

	// Export to popular environments boilerplate.
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (Logger),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Logger;
	}
	else {
		Logger._prevLogger = global.Logger;

		Logger.noConflict = function () {
			global.Logger = Logger._prevLogger;
			return Logger;
		};

		global.Logger = Logger;
	}
}(this));


/***/ })

/******/ });
});
//# sourceMappingURL=statsService.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EVENT_TYPES = {
  MEDIA_LOADED: 2,
  PLAY: 3,
  PLAY_REACHED_25: 4,
  PLAY_REACHED_50: 5,
  PLAY_REACHED_75: 6,
  PLAY_REACHED_100: 7,
  OPEN_EDIT: 8,
  OPEN_VIRAL: 9,
  OPEN_DOWNLOAD: 10,
  OPEN_REPORT: 11,
  OPEN_FULL_SCREEN: 14,
  CLOSE_FULL_SCREEN: 15,
  REPLAY: 16,
  SEEK: 17,
  OPEN_UPLOAD: 18,
  SAVE_PUBLISH: 19,
  CLOSE_EDITOR: 20,
  PRE_BUMPER_PLAYED: 21,
  POST_BUMPER_PLAYED: 22,
  BUMPER_CLICKED: 23,
  PREROLL_STARTED: 24,
  MIDROLL_STARTED: 25,
  POSTROLL_STARTED: 26,
  OVERLAY_STARTED: 27,
  PREROLL_CLICKED: 28,
  MIDROLL_CLICKED: 29,
  POSTROLL_CLICKED: 30,
  OVERLAY_CLICKED: 31,
  PREROLL_25: 32,
  PREROLL_50: 33,
  PREROLL_75: 34,
  MIDROLL_25: 35,
  MIDROLL_50: 36,
  MIDROLL_75: 37,
  POSTROLL_25: 38,
  POSTROLL_50: 39,
  POSTROLL_75: 40
};

exports.default = EVENT_TYPES;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event =
//will indicate if the event is thrown for the first video in the session

/*//will be retrieved from the request of the user
 userIp:string;
  //the time in milliseconds the event took
 processDuration: number;
  //the id of the GUI control - will be used in the future to better understand what the user clicked
 controlId:string;
 */
//true if the user ever used seek in this session

//the timestamp along the video when the event happend

//a unique string generated by the client that will represent the client-side session: the primary component will pass it on to other components that sprout from it
function Event(eventType) {
  _classCallCheck(this, Event);

  this.eventType = eventType;
  this.isFirstInSession = false;
  this.eventTimestamp = new Date().getTime();
  this.uiconfId = 0;
}
//kaltura application name

/*//timestamp of the new point on the timeline of the video after the user seeks
 newPoint: number;
 */
//the referrer of the client

//the duration of the video in milliseconds - will make it much faster than quering the db for each entry

//the partner's user id


/* //the UV cookie - creates in the operational system and should be passed on ofr every event
 uniqueViewer: string;*/

//the client's timestamp of this event
;

exports.default = Event;

/***/ })
/******/ ]);
});
//# sourceMappingURL=playkit-kanalytics.js.map