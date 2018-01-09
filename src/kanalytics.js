//@flow
import {BasePlugin} from 'playkit-js'
import {OVPStatsService, RequestBuilder} from 'playkit-js-providers/dist/playkit-stats-service'
import EventTypes from './event-types'
import Event from './event'

const SEEK_OFFSET: number = 2000;
const LIVE: string = 'Live';

/**
 * @classdesc
 */
export default class KAnalytics extends BasePlugin {
  /**
   * @static
   */
  static defaultConfig: Object = {
    serviceUrl: '//stats.kaltura.com/api_v3/index.php',
    hasKanalony: false
  };

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
  _lastSeekEvent: number = 0;
  /**
   * Whether seeking occurred
   * @private
   */
  _hasSeeked: boolean = false;
  /**
   * The ended flag
   * @private
   */
  _ended: boolean = false;
  /**
   * The Kaltura session
   * @private
   */
  _ks: string = "";
  /**
   * Indicate whether time percent event already sent
   * @private
   */
  _timePercentEvent: { [event: string]: boolean } = {};
  /**
   * Indicate whether widget loaded event already sent
   * @private
   */
  _widgetLoadedEventSent: boolean = false;

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player reference.
   * @param {Object} config - The plugin configuration.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._registerListeners();
  }

  /**
   * Reset the plugin flags
   * @return {void}
   */
  reset(): void {
    this._hasSeeked = false;
    this._ended = false;
    this._ks = "";
    this._timePercentEvent = {};
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
    const PlayerEvent = this.player.Event;
    this.eventManager.listen(this.player, PlayerEvent.SOURCE_SELECTED, this._onSourceSelected.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.FIRST_PLAY, this._sendAnalytics.bind(this, EventTypes.PLAY));
    this.eventManager.listen(this.player, PlayerEvent.PLAY, this._onPlay.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.ENDED, this._onEnded.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.SEEKED, this._sendSeekAnalytic.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.TIME_UPDATE, this._sendTimePercentAnalytic.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.PLAYER_STATE_CHANGED, this._onPlayerStateChanged.bind(this));
  }

  /**
   * The source selected event listener
   * @private
   * @return {void}
   */
  _onSourceSelected(): void {
    this.player.ready().then(() => {
      if (!this._widgetLoadedEventSent) {
        this._sendAnalytics(EventTypes.WIDGET_LOADED);
        this._widgetLoadedEventSent = true
      }
      this._sendAnalytics(EventTypes.MEDIA_LOADED);
    });
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
   * The player state changed event listener
   * @param {any} event - the event
   * @private
   * @return {void}
   */
  _onPlayerStateChanged(event: any): void {
    if (event.payload.newState.type === this.player.State.BUFFERING) {
      this._sendAnalytics(EventTypes.BUFFER_START);
    }
    if (event.payload.oldState.type === this.player.State.BUFFERING) {
      this._sendAnalytics(EventTypes.BUFFER_END);
    }
  }

  /**
   * Send seek analytic
   * @private
   * @return {void}
   */
  _sendSeekAnalytic(): void {
    const now = new Date().getTime();
    if ((this._lastSeekEvent + SEEK_OFFSET < now) && (this.player.config.type !== LIVE || this.player.config.dvr)) {
      // avoid sending lots of seeking while scrubbing
      this._sendAnalytics(EventTypes.SEEK);
      this._hasSeeked = true;
    }
    this._lastSeekEvent = now;
  }

  /**
   * Send time percent analytic
   * @private
   * @return {void}
   */
  _sendTimePercentAnalytic(): void {
    if (this.player.config.type !== LIVE) {
      const percent = this.player.currentTime / this.player.duration;
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
  }

  /**
   * Get the player params which relevant to analytics request
   * @private
   * @return {Object} - The player params
   */
  get _playerParams(): Object {
    this._ks = this.config.ks;
    return {
      clientVer: this.config.playerVersion,
      entryId: this.config.entryId,
      sessionId: this.config.sessionId,
      uiConfId: this.config.uiConfId || 0,
      partnerId: this.config.partnerId,
      widgetId: this.config.partnerId ? "_" + this.config.partnerId : "",
      referrer: document.referrer || document.URL
    };
  }

  /**
   * Register the player event listeners
   * @param {number} eventType - The event type
   * @private
   * @return {void}
   */
  _sendAnalytics(eventType: number): void {
    const statsEvent = new Event(eventType);
    statsEvent.currentPoint = this.player.currentTime;
    statsEvent.duration = this.player.duration;
    statsEvent.seek = this._hasSeeked;
    statsEvent.hasKanalony = this.config.hasKanalony;
    Object.assign(statsEvent, this._playerParams);
    const request: RequestBuilder = OVPStatsService.collect(this.config.serviceUrl, this._ks, this.config.playerVersion, {"event": statsEvent});
    request.doHttpRequest()
      .then(() => {
        this.logger.debug(`Analytics event sent `, statsEvent);
      }, err => {
        this.logger.error(`Failed to send analytics event `, statsEvent, err);
      });
  }
}
