// @flow
import {registerPlugin} from 'playkit-js';
import KAnalytics from './kanalytics';

declare var __VERSION__: string;
declare var __NAME__: string;

export default KAnalytics;
export {__VERSION__ as VERSION, __NAME__ as NAME};

const pluginName = 'kanalytics';
/**
 * Register the plugin in the playkit-js plugin framework.
 */
registerPlugin(pluginName, KAnalytics);
