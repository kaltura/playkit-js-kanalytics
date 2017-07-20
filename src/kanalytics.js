//@flow
import {BasePlugin, registerPlugin, VERSION} from 'playkit-js'
import StatsService from 'playkit-js-providers/dist/statsService'
import EventTypes from './event-types'
import Event from './event'

const pluginName = "kanalytics";
const SEEK_OFFSET: number = 2000;

/**
 * @classdesc
 */
export default class KAnalytics extends BasePlugin {
  /**
   * @static
   */
  static defaultConfig: Object = {};

  /**
   * @static
   * @public
   * @returns {boolean} - Whether the plugin is valid.
   */
  static isValid(): boolean {
    return true;
  }

  /**
   * The time of the last seek event
   * @private
   */
  _lastSeekEvent: number;
  /**
   * Whether seeking occurred
   * @private
   */
  _hasSeeked: boolean;
  /**
   * Indicate whether time percent event already sent
   * @private
   */
  _timePercentEvent: { [event: string]: boolean };
  /**
   * The player params which relevant to analytics request
   * @private
   */
  _playerConfParams: ?Object;
  /**
   * The Kaltura session
   * @private
   */
  _ks: string;

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player reference.
   * @param {Object} config - The plugin configuration.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._initializeMembers();
    this._registerListeners();
  }

  /**
   * @public
   * @return {void}
   */
  destroy(): void {
    this.eventManager.destroy();
  }

  /**
   * Register the player event listeners
   * @private
   * @return {void}
   */
  _registerListeners(): void {
    let PlayerEvent = this.player.Event;
    this.eventManager.listen(this.player, PlayerEvent.FIRST_PLAY, this._sendAnalytics.bind(this, EventTypes.PLAY));
    this.eventManager.listen(this.player, PlayerEvent.PLAY, this._onPlay.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.ENDED, this._onEnded.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.SEEKED, this._sendSeekAnalytic.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.TIME_UPDATE, this._sendTimePercentAnalytic.bind(this));

  }

  /**
   * The play event listener
   * @private
   * @return {void}
   */
  _onPlay(): void {
    if (this._ended) {
      this._ended = false;
      this._sendAnalytics(EventTypes.REPLAY);
    }
  }

  /**
   * The ended event listener
   * @private
   * @return {void}
   */
  _onEnded(): void {
    this._ended = true;
  }

  /**
   * Send seek analytic
   * @private
   * @return {void}
   */
  _sendSeekAnalytic(): void {
    let now = new Date().getTime();
    if (this._lastSeekEvent === 0 || this._lastSeekEvent + SEEK_OFFSET < now) {
      // avoid sending lots of seeking while scrubbing
      this._sendAnalytics(EventTypes.SEEK);
    }
    this._lastSeekEvent = now;
    this._hasSeeked = true;
  }

  /**
   * Send time percent analytic
   * @private
   * @return {void}
   */
  _sendTimePercentAnalytic(): void {
    let percent = this.player.currentTime / this.player.duration;
    if (!this._timePercentEvent.PLAY_REACHED_25 && percent >= .25) {
      this._timePercentEvent.PLAY_REACHED_25 = true;
      this._sendAnalytics(EventTypes.PLAY_REACHED_25);
    }
    if (!this._timePercentEvent.PLAY_REACHED_50 && percent >= .50) {
      this._timePercentEvent.PLAY_REACHED_50 = true;
      this._sendAnalytics(EventTypes.PLAY_REACHED_50);
    }
    if (!this._timePercentEvent.PLAY_REACHED_75 && percent >= .75) {
      this._timePercentEvent.PLAY_REACHED_75 = true;
      this._sendAnalytics(EventTypes.PLAY_REACHED_75);
    }
    if (!this._timePercentEvent.PLAY_REACHED_100 && percent >= .98) {
      this._timePercentEvent.PLAY_REACHED_100 = true;
      this._sendAnalytics(EventTypes.PLAY_REACHED_100);
    }
  }

  /**
   * Get the player params which relevant to analytics request
   * @private
   * @return {Object} - The player params
   */
  get _playerParams(): Object {
    if (!this._playerConfParams) {
      let playerConfig = this.player.config;
      let playerConfParams: Object = {
        clientVer: VERSION,
        referrer: document.referrer,
        entryId: playerConfig.id,
        uiconfId: 0
      };
      let session = playerConfig.session;
      if (session) {
        playerConfParams.sessionId = session.id;
        playerConfParams.partnerId = session.partnerID;
        playerConfParams.widgetId = "_" + session.partnerID;
        playerConfParams.uiconfId = session.uiConfID;
        this._ks = session.ks;
      }
      if (playerConfig.contextId) {
        playerConfParams.contextId = playerConfig.contextId;
      }
      if (playerConfig.featureType) {
        playerConfParams.featureType = playerConfig.featureType;
      }
      if (playerConfig.applicationId) {
        playerConfParams.applicationId = playerConfig.applicationId;
      }
      if (playerConfig.userId) {
        playerConfParams.userId = playerConfig.userId;
      }
      this._playerConfParams = playerConfParams;
    }
    return this._playerConfParams;
  }

  /**
   * Register the player event listeners
   * @param {number} eventType - The event type
   * @private
   * @return {void}
   */
  _sendAnalytics(eventType: number): void {
    let statsEvent = new Event(eventType);
    statsEvent.currentPoint = this.player.currentTime;
    statsEvent.duration = this.player.duration;
    statsEvent.seek = this._hasSeeked;
    Object.assign(statsEvent, this._playerParams);

    let request: RequestBuilder = StatsService.collect(this._ks, {"event": statsEvent});
    request.doHttpRequest()
      .then(() => {
          this.logger.debug(`Analytics event sent `, statsEvent);
        },
        err => {
          this.logger.error(`Failed to send analytics event `, statsEvent, err);
        });
  }

  /**
   * Initialize the plugin members
   * @private
   * @return {void}
   */
  _initializeMembers(): void {
    this._playerConfParams = null;
    this._ks = "";
    this._ended = false;
    this._timePercentEvent = {};
    this._lastSeekEvent = 0;
    this._hasSeeked = false;
  }
}

/**
 * Register the plugin in the playkit-js plugin framework.
 */
registerPlugin(pluginName, KAnalytics);
