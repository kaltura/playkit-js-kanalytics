// @flow
import {registerPlugin} from 'kaltura-player-js';
import KAnalytics from './kanalytics';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export default KAnalytics;
export {VERSION, NAME};

const pluginName = 'kanalytics';
/**
 * Register the plugin in the playkit-js plugin framework.
 */
registerPlugin(pluginName, KAnalytics);
