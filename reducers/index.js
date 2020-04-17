import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import networkReducer from "./networkReducer";
import configsReducer from "./configsReducer";
import navReducer from "./navReducer";
import toastReducer from "./toastReducer";
import miningAlgoReducer from "./miningAlgoReducer";
import formReducer from "./formReducer";
import offersReducer from "./offersReducer";
import inventoryReducer from "./inventoryReducer";
import timeReducer from './timeReducer';
import hashrateReducer from './hashrateReducer';
import paymentReducer from './paymentReducer';
import bidsReducer from './bidsReducer';
import statsReducer from './statsReducer';
import globalStratumConfigs from './globalStratumConfigs';
import marketmonitorReducer from './marketmonitorReducer';

export default combineReducers({
  errors: errorReducer,
  profile: profileReducer,
  network: networkReducer,
  configs: configsReducer,
  nav: navReducer,
  toast: toastReducer,
  form: formReducer,
  hashrate: hashrateReducer,
  miningalgo: miningAlgoReducer,
  offers: offersReducer,
  inventory: inventoryReducer,
  time: timeReducer,
  payment: paymentReducer,
  bids: bidsReducer,
  stats: statsReducer,
  marketdata: marketmonitorReducer,
  settings: globalStratumConfigs
});
