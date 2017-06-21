//@flow
import {BasePlugin, registerPlugin, VERSION} from 'playkit-js'
import StatsService from 'playkit-js-providers/dist/statsService'
import EventTypes from './event-types'
import Event from './event'

const pluginName = "kanalytics";


/**
 * Your class description.
 * Your class description.
 * @classdesc
 */
export default class Kanalytics extends BasePlugin {
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

  // Stores the last time we issued a seek event
  // avoids sending lots of seeks while scrubbing
  _lastSeekEventTime: number;
  _lastSeek: number;
  _hasSeeked: boolean;
  _playingEventsState: { [event: string]: boolean };

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player reference.
   * @param {Object} config - The plugin configuration.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._initializeMembers();
    this.registerListeners();


    /**
     Now you have access to the BasePlugin members:
     1. config: The runtime configuration of the plugin.
     2. name: The name of the plugin.
     3. logger: The logger of the plugin.
     4. player: Reference to the actual player.
     5. eventManager: The event manager of the plugin.
     */
  }

  /**
   * @public
   * @return {void}
   */
  destroy(): void {
    this._initializeMembers();
    this.eventManager.destroy();
  }

  registerListeners(): void {
    let PlayerEvent = this.player.Event;
    this.eventManager.listen(this.player, PlayerEvent.FIRST_PLAY, this._sendAnalyticsEvent.bind(this, EventTypes.PLAY));
    this.eventManager.listen(this.player, PlayerEvent.PLAY, this._onPlay.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.ENDED, this._onEnded.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.SEEKED, this._sendSeekEvent.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.TIME_UPDATE, this._sendTimeEvent.bind(this));

  }

  _onPlay(): void {
    if (this._ended) {
      this._ended = false;
      this._sendAnalyticsEvent(EventTypes.REPLAY);
    }
  }

  _onEnded(): void {
    this._ended = true;
  }

  _sendSeekEvent(): void {
    if (this._lastSeekEventTime == 0 ||
      this._lastSeekEventTime + 2000 < new Date().getTime()) {
      this._sendAnalyticsEvent(EventTypes.SEEK);
    }
    this._lastSeekEventTime = new Date().getTime();
    this._hasSeeked = true;
    this._lastSeek = this.player.currentTime;
  }

  _sendTimeEvent(): void {

    let percent = this.player.currentTime / this.player.duration;

    if (!this._playingEventsState.PLAY_REACHED_25 && percent >= .25) {
      this._playingEventsState.PLAY_REACHED_25 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_25);
    }
    if (!this._playingEventsState.PLAY_REACHED_50 && percent >= .50) {
      this._playingEventsState.PLAY_REACHED_50 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_50);
    }
    if (!this._playingEventsState.PLAY_REACHED_75 && percent >= .75) {
      this._playingEventsState.PLAY_REACHED_75 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_75);
    }
    if (!this._playingEventsState.PLAY_REACHED_100 && percent >= .98) {
      this._playingEventsState.PLAY_REACHED_100 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_100);
    }
  }

  _sendAnalyticsEvent(eventType: number): void {
    let ks;
    let statsEvent = new Event(eventType);
    statsEvent.clientVer = VERSION;
    statsEvent.currentPoint = this.player.currentTime;
    statsEvent.duration = this.player.duration;
    let config = this.player.config;
    if (config) {
      statsEvent.entryId = config.id;
      let session = config.session;
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

    let request: RequestBuilder = StatsService.collect(ks, {"event": statsEvent});
    request.doHttpRequest()
      .then(() => {
          this.logger.debug(`Analitycs event sent`, statsEvent);
        },
        err => {
          this.logger.error(`Failed to send analitycs event`, statsEvent, err);
        });

  }

  _initializeMembers() {
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
}

/**
 * Register the plugin in the playkit-js plugin framework.
 */
registerPlugin(pluginName, Kanalytics);
