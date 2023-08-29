/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Global from './global';
import Setup from './src/views/setup';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Setup);
