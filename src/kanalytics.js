//@flow
import {BasePlugin, registerPlugin, VERSION, FakeEvent} from 'playkit-js'
import {StatsService, Configuration} from 'playkit-js-providers/dist/statsService.min'
import EventTypes from './event-types'
import Event from './event'

const pluginName = "kanalytics";


/**
 * Your class description.
 * @classdesc
 */
class Kanalytics extends BasePlugin {
  /**
   * TODO: Override and define your default configuration for the plugin.
   * @static
   */
  static defaultConfig: Object = {};

  /**
   * TODO: Define under what conditions the plugin is valid.
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
  _playingEventsState: {[event: string]: boolean};

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
   * TODO: Define the destroy logic of your plugin.
   * @public
   * @return {void}
   */
  destroy(): void {
    this._initializeMembers();
    this.eventManager.destroy();
  }

  registerListeners(): void {
    var PlayerEvent = this.player.Event;
    this.eventManager.listen(this.player, PlayerEvent.PLAY, this._sendAnalyticsEvent.bind(this, EventTypes.PLAY));
    this.eventManager.listen(this.player, PlayerEvent.TIME_UPDATE, this._sendTimeAnalytics.bind(this));
    this.eventManager.listen(this.player, PlayerEvent.SEEKED, this._setSeeked.bind(this));

  }

  _setSeeked(evebt: FakeEvent): void {
    if (this._lastSeekEventTime == 0 ||
      this._lastSeekEventTime + 2000 < new Date().getTime()) {
      this._sendAnalyticsEvent(EventTypes.SEEK);
    }
    this._lastSeekEventTime = new Date().getTime();
    this._hasSeeked = true;
    this._lastSeek = this.player.currentTime;
  }

  _sendTimeAnalytics(): void {

    let percent = this.player.currentTime / this.player.duration;
    let seekPercent = this._lastSeek / this.player.duration;

    if (!this._playingEventsState.PLAY_REACHED_25 && percent >= .25 && seekPercent <= .25) {
      this._playingEventsState.PLAY_REACHED_25 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_25);
    }
    else if (!this._playingEventsState.PLAY_REACHED_50 && percent >= .50 && seekPercent < .50) {
      this._playingEventsState.PLAY_REACHED_50 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_50);
    }
    else if (!this._playingEventsState.PLAY_REACHED_75 && percent >= .75 && seekPercent < .75) {
      this._playingEventsState.PLAY_REACHED_75 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_75);
    }
    else if (!this._playingEventsState.PLAY_REACHED_100 && percent >= .98 && seekPercent < 1) {
      this._playingEventsState.PLAY_REACHED_75 = true;
      this._sendAnalyticsEvent(EventTypes.PLAY_REACHED_75);
    }
  }

  _sendAnalyticsEvent(eventType: EventTypes): void {

    let statsEvent = new Event(eventType);
    statsEvent.clientVer = VERSION;
    statsEvent.currentPoint = this.player.currentTime;
    statsEvent.duration = this.player.duration;

    if (this.player.config) {
      statsEvent.partnerID = this.player.config.partnerID;
      statsEvent.uiconfId = this.player.config.uiConfID;
      statsEvent.entryId = this.player.config.id;
    }
    statsEvent.seek = this._hasSeeked;
    statsEvent.widgetId = "_" + this.player.config.partnerID;

    //TO DO: set this properties correctlly
    statsEvent.contextId = 0;
    statsEvent.featureType = 0;
    statsEvent.applicationId = "";
    statsEvent.userId = 0;
    statsEvent.referrer = document.referrer;

    let providerConfig = Configuration.get();
    let request: RequestBuilder = StatsService.collect(providerConfig.beUrl, this.player.config.ks, {"event": statsEvent});
    request.doHttpRequest()
      .then(() => {
          this.logger.info(`Analitycs event sent`, statsEvent);
        },
        err => {
          this.logger.error(`Failed to send analitycs event`, statsEvent, err);
        });

  }

  _initializeMembers() {
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
