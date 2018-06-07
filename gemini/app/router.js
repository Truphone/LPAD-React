import { createRouter } from '@expo/ex-navigation';
import Splash from './containers/Splash';
import Home from './containers/Home';
import SelectProduct from './containers/SelectProduct';
import Payment from './containers/Payment';
import Thankyou from './containers/Thankyou';
import Summary from './containers/Summary';
import Checkout from './containers/Checkout';
import Download from './containers/Download';
import ListProfiles from './containers/ListProfiles';
import ScanCode from './containers/ScanCode';
import SelectOperator from './containers/SelectOperator';

export const router = createRouter(() => ({
  splash: () => Splash,
  selectproduct: () => SelectProduct,
  payment: () => Payment,
  home: () => Home,
  thankyou: () => Thankyou,
  summary: () => Summary,
  checkout: () => Checkout,
  download: () => Download,
  profiles: () => ListProfiles,
  scancode: () => ScanCode,
  selectoperator: () => SelectOperator,
}));
