import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './icon-font.json';
const MyIcon = createIconSetFromFontello(fontelloConfig, 'fontello');
export default MyIcon;