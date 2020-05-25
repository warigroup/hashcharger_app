import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import networkReducer from "./networkReducer";
import configsReducer from "./configsReducer";
import navReducer from "./navReducer";
import miningAlgoReducer from "./miningAlgoReducer";
import formReducer from "./formReducer";
import offersReducer from "./offersReducer";
import timeReducer from './timeReducer';
import hashrateReducer from './hashrateReducer';
import paymentReducer from './paymentReducer';
import bidsReducer from './bidsReducer';
import statsReducer from './statsReducer';
import globalStratumConfigs from './globalStratumConfigs';
import themeReducer from './themeReducer';
import tokenReducer from './tokenReducer';
import subuserReducer from './subuserReducer';
import estimateReducer from './estimateReducer';

export default combineReducers({
  errors: errorReducer,
  profile: profileReducer,
  network: networkReducer,
  configs: configsReducer,
  nav: navReducer,
  form: formReducer,
  hashrate: hashrateReducer,
  miningalgo: miningAlgoReducer,
  offers: offersReducer,
  time: timeReducer,
  payment: paymentReducer,
  bids: bidsReducer,
  stats: statsReducer,
  settings: globalStratumConfigs,
  theme: themeReducer,
  token: tokenReducer,
  subuser: subuserReducer,
  estimate: estimateReducer
});
