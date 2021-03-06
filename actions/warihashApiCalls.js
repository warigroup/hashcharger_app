import axios from "axios";
import * as types from "./types";
import { apiurl } from "../settings";
import { TIMEOUT_DURATION } from "../utils/timeout-config";
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

//////// AUTH ACTIONS ////////////////////////////////
export const resetErrors = () => {
  return {
    type: types.RESET_ERRORS
  };
};

/////// REMOVE ALERTS ////////////////////////////////
export const clearAlert = () => {
  return {
    type: types.CLEAR_ALERT
  };
};

/////// CLEAR ERRORS & OPEN ALERT /////////////////////
export const clearErrorsShowAlert = () => {
  return {
    type: types.CLEAR_ERRORS_SHOW_ALERT
  };
};

/////// RESET NETWORK ERRORS //////////////////////////
export const clearNetwork = () => {
  return {
    type: types.CLEAR_NETWORK_CODE
  };
};

//////// GET CONFIGS /////////////////////////////////
export const getConfigs = () => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_configs/`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.GET_CONFIGS_DATA,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};


//////// GET OFFERS (PROFILE PAGE) //////////////////////////
export const getOffers = (pagenumber, token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_offers/?page=${pagenumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        },
        sub_id: "widgetaccount@protonmail.com"
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.GET_OFFERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      })
    );
};

//////// LOAD OFFER DETAILS //////////////////////////
export const getOfferInfo = (offerid) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_offers/?offer_id=${offerid}`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.GET_OFFER_INFO,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      })
    );
};

export const clearOffers = () => {
  return {
    type: types.CLEAR_OFFERS
  };
};

//////// MAKE OFFER ACTIONS //////////////////////////
export const clearPaymentInfo = () => {
  return {
    type: types.CLEAR_PAYMENT_INFO
  };
};

///// OPEN INVOIEC FROM PROFILE PAGE, NAVIGATION ////////////////
export const setOldInvoiceId = (invoice_id) => {
  return {
    type: types.SET_OLD_INVOICE_ID,
    payload: invoice_id
  };
};

export const setRecentInvoiceId = (invoice_id) => {
  return {
    type: types.SET_RECENT_INVOICE_ID,
    payload: invoice_id
  };
};

//////// MINING ALGO SELECT /////////////////////////////////
export const algoSelect = algorithm_name => {
  return {
    type: types.ALGOCHANGE,
    payload: algorithm_name
  };
};

//////// NAVIGATION ACTIONS //////////////////////////
export const marketplacePage = () => {
  return {
    type: types.MARKETPLACE_PAGE
  };
};

export const invoicePage = () => {
  return {
    type: types.INVOICE_PAGE
  };
};

export const orderHistoryPage = () => {
  return {
    type: types.ORDER_HISTORY_PAGE
  };
};

export const notFoundPage = () => {
  return {
    type: types.NOT_FOUND_PAGE
  };
};

//////// PROFILE ACTIONS /////////////////////////////
export const getCurrentProfile = (token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(`${apiurl}/user_info/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `CustomToken ${token}`
      }
    }, { cancelToken: source.token })
    .then(res => dispatch({ type: types.GET_PROFILE, payload: res.data }))
    .catch(err => {
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};

export const resetProfileLoading = () => {
  return {
    type: types.RESET_PROFILE_LOADING
  };
};

//////// TAKE OFFER ACTIONS //////////////////////////
export const takeOffer = (
  hashrate,
  hashrate_units,
  mining_algo,
  duration,
  host,
  port,
  username,
  password,
  location,
  limit_price,
  refund_address,
  sub_user,
  token
) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/bid_make_token/`,
      {
        hashrate: hashrate,
        hashrate_units: hashrate_units,
        mining_algo: mining_algo,
        duration: duration,
        host: host,
        port: port,
        username: username,
        password: password,
        location: location,
        limit_price: limit_price,
        refund_address: refund_address,
        sub_user: sub_user
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.PAYMENT_INFO,
        payload: res.data
      });
      dispatch({ type: types.CLEAR_ERRORS_SHOW_ALERT });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERRORS,
        payload: (err.response || {}).data
      });
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};

//////// GET BIDS ACTIONS //////////////////////////
export const getBids = (number, sub_user, token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_bids/?page=${number}&sub_user=${sub_user}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({
      type: types.GET_BIDS,
      payload: res.data
    })
    )
    .catch(err => {
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};

export const getBidInfo = (bid_id, token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_bids/?bid_id=${bid_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({
      type: types.GET_BID_INFO,
      payload: res.data
    })
    )
    .catch(err => {
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};


export const clearBids = () => {
  return {
    type: types.CLEAR_BIDS
  };
};

/////// FORM SUBMISSION /////////////////////////////////
export const formSubmission = () => {
  return {
    type: types.FORM_SUBMITTED
  };
};

export const enableNavigation = () => {
  return {
    type: types.ENABLE_NAVIGATION
  };
};

////// TIME OUT ERROR HANDLING /////////////////////////
export const timeoutError = () => {
  return {
    type: types.TIMEOUT_ERROR
  };
};

export const timeoutReset = () => {
  return {
    type: types.TIMEOUT_RESET
  };
};

/////// GET HASHRATE INFO ///////////////////////////////
export const getHashrateInfo = (idnumber, token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_hashrate_info/?offer_id=${idnumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.GET_HASHRATE_INFO, payload: res.data }))
    .catch(err => {
      dispatch({
        type: types.GET_ERRORS,
        payload: (err.response || {}).data
      });
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};

export const getBidHashrateChart = (idnumber, token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_hashrate_info/?bid_id=${idnumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.GET_HASHRATE_INFO, payload: res.data }))
    .catch(err => {
      dispatch({
        type: types.GET_ERRORS,
        payload: (err.response || {}).data
      });
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};


///// CLEAR HASHRATE DATA /////////////////////////
export const clearHashrateData = () => {
  return {
    type: types.CLEAR_HASHRATE_DATA
  };
};

///////// SET GLOBAL STRATUM, USER CONFIGS /////////////////////
export const setStratumHostPort = (host, port) => {
  return {
    type: types.SET_STRATUM_HOST_PORT,
    payload: [{ host: host }, { port: port }]
  };
};

export const setStratumUsernamePass = (username, password) => {
  return {
    type: types.SET_STRATUM_USERNAME_PASS,
    payload: [{ username: username }, { password: password }]
  };
};

export const setThemeColors = (navbg, navtexts, primary, secondary, buttontexts, tabletexts, fullscreen) => {
  return {
    type: types.SET_THEME_COLORS,
    payload: [
      { navbg: navbg }, 
      { navtexts: navtexts }, 
      { primary: primary }, 
      { secondary: secondary }, 
      { buttontexts: buttontexts }, 
      { tabletexts: tabletexts }, 
      { fullscreen: fullscreen }
    ]
  };
};

export const setToken = token => {
  return {
    type: types.SET_TOKEN,
    payload: token
  };
};

export const setSubUser = subuser => {
  return {
    type: types.SET_SUBUSER,
    payload: subuser
  };
};

/////// GET ESTIMATE ///////////////////////////////
export const getEstimate = (
  duration,
  hashrate,
  hashrate_units,
  mining_algo,
  location,
  limit_price,
  token
) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/estimate_get/?duration=${duration}&hashrate=${hashrate}&hashrate_units=${hashrate_units}&mining_algo=${mining_algo}&location=${location}&limit_price=${limit_price}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `CustomToken ${token}`
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.GET_ESTIMATE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERRORS,
        payload: (err.response || {}).data
      });
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};
