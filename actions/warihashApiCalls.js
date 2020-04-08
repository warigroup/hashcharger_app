import axios from "axios";
import * as types from "./types";
import getCookie from "../utils/getCookie";
import { apiurl, googleAnalytics, facebookPixel } from "../settings";
import { TIMEOUT_DURATION } from "../utils/timeout-config";
import { csrfcookie } from "../utils/cookieNames";
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

//////// AUTH ACTIONS ////////////////////////////////
export const logoutUser = () => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const instance = axios.create({
    baseURL: `${apiurl}`,
    timeout: TIMEOUT_DURATION
  });
  instance.defaults.withCredentials = true;
  instance.defaults.crossDomain = true;

  instance.post(
    "/logout/",
    { [`${csrfcookie}`]: csrftoken },
    {
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken }
    }
  );
  dispatch(setCurrentUser({}));
};

export const loginUser = () => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);

  const instance = axios.create({
    baseURL: `${apiurl}`
  });
  instance.defaults.withCredentials = true;
  instance.defaults.crossDomain = true;
  instance
    .post(
      "/token_get/",
      {
        username: 'widgetaccount',
        password: 'AJ542#^@%4thw!!9y5829!'
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch(setCurrentUser('widgetaccount'));
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

export const resetErrors = () => {
  return {
    type: types.RESET_ERRORS
  };
};

// set logged in user
export const setCurrentUser = username => {
  return {
    type: types.SET_CURRENT_USER,
    payload: username
  };
};

export const registerUser = (username, email, password) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/auth/users/`,
      {
        username: username,
        email: email,
        password: password
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
      });
      if (googleAnalytics === "on") {
        window.gtag('event', 'conversion', {'send_to': 'AW-693268366/kN-yCOO-3rQBEI7fycoC'});
        window.ga('send', {
          hitType: 'event',
          eventCategory: 'marketplace',
          eventAction: 'registration',
          eventLabel: 'Marketplace Events'
        });
      };
      if (facebookPixel === "on") {
        window.fbq('track', 'CompleteRegistration');
      };
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

export const registerWithReferralCode = (username, email, password, referrer_code) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/auth/users/`,
      {
        username: username,
        email: email,
        password: password,
        referrer_code: referrer_code
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
      });
      if (googleAnalytics === "on") {
        window.gtag('event', 'conversion', {'send_to': 'AW-693268366/kN-yCOO-3rQBEI7fycoC'});
      };
      if (facebookPixel === "on") {
        window.fbq('track', 'CompleteRegistration');
      };
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

export const resendActivation = email => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/auth/users/resend_activation/`,
      { email: email },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
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

export const sendResetEmail = email => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/auth/users/reset_password/`,
      {
        email: email
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
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

export const redirectErrorMessage = () => {
  return {
    type: types.REDIRECT_MESSAGE
  };
};

export const notFoundMessage = () => {
  return {
    type: types.NOT_FOUND_MESSAGE
  };
};

export const cantTakeOwnOffer = () => {
  return {
    type: types.CANT_TAKE_OWN_OFFER
  };
};

export const removeToast = () => {
  return {
    type: types.NULL_TOAST
  };
};

//////// CANCEL OFFER ACTIONS ////////////////////////

export const cancelOffer = offerId => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  const csrftoken = getCookie(`${csrfcookie}`);
  return axios
    .post(
      `${apiurl}/offer_cancel/`,
      { offer_id: offerId },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({ type: types.CLEAR_ERRORS_SHOW_ALERT });
    })
    .catch(err => {
      dispatch({
        type: types.GET_ERRORS_CANCEL_OFFER,
        payload: (err.response || {}).data
      });
      console.log(err);
    });
};

export const cancelOrder = offerId => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  const csrftoken = getCookie(`${csrfcookie}`);
  return axios
    .post(
      `${apiurl}/offer_take_cancel/`,
      { offer_take_id: offerId },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.CLEAR_ERRORS_ORDER_CANCEL
      });
    })
    .catch(err => {
      dispatch({
        type: types.ORDER_CANCEL_FAIL,
        payload: (err.response || {}).data
      });
    });
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


/////// GET OFFERS (MARKET MONITOR PAGE) /////

export const loadActiveOffers = (miningalgorithm, pagenumber) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_offers/?mining_algo=${miningalgorithm}&page=${pagenumber}&active=true&all=true`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.LOAD_ACTIVE_OFFERS,
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

//////// GET OFFERS (PROFILE PAGE) //////////////////////////

export const getOffers = (pagenumber) => dispatch => {
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
          "Content-Type": "application/json"
        }
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

/////// LOAD TAKEN OFFERS (OLD) ////////////////////////////

export const loadTakenOffers = algorithm => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_settlements/?mining_algo=${algorithm}`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.LOAD_TAKEN_OFFERS,
        payload: res.data
      })
    )
    .catch(err => {
      console.log(err);
    });
};


/////// LOAD SETTLEMENTS (USER PROFILE PAGE) //////////

export const getSettlements = (offer_take_id) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_settlements/?offer_take_id=${offer_take_id}`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.GET_SETTLEMENTS_PROFILE,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

/////// POST ACTIVATION DATA /////////////////////////

export const postActivationData = (uid, token) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/auth/users/activation/`,
      {
        uid: uid,
        token: token
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.ACTIVATION_SUCCESSFUL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: types.ACTIVATION_FAILED,
        payload: (err.response || {}).data
      })
    );
};

export const resetActivationStatus = () => {
  return {
    type: types.RESET_ACTIVATION_STATUS
  };
};

/////// PASSWORD RESET ///////////////////////////////

export const postPasswordResetData = (
  uid,
  token,
  password,
  passwordconfirm
) => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/auth/users/reset_password_confirm/`,
      {
        uid: uid,
        token: token,
        new_password: password,
        re_new_password: passwordconfirm
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.RESET_PASSWORD_SUCCESSFUL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: types.RESET_PASSWORD_FAILED,
        payload: (err.response || {}).data
      })
    );
};

export const nullResetStatus = () => {
  return {
    type: types.NULL_RESET_STATUS
  };
};

//////// MAKE OFFER ACTIONS //////////////////////////

export const makeOffer = (
  miner_id,
  price,
  mining_algo,
  host,
  port,
  username,
  password
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  var data = {
    miner_id: miner_id,
    price: price,
    mining_algo: mining_algo
  };
  if (host) {
    data["host"] = host;
    data["port"] = port;
    data["username"] = username;
    data["password"] = password;
  }
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/offer_make/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
      });
    }
    )
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

export const clearPaymentInfo = () => {
  return {
    type: types.CLEAR_PAYMENT_INFO
  };
};

///// MINERS FORM ///////////////////////////////////

export const getMinersList = algorithm => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_miners/?mining_algo=${algorithm}`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
        dispatch({
          type: types.GET_MINERS_LIST,
          payload: res.data
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const addMiners = (
  name,
  declared_hashrate,
  hashrate_units,
  mining_algo,
  location,
  triggered
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/add_miner/`,
      {
        name: name,
        declared_hashrate: declared_hashrate,
        hashrate_units: hashrate_units,
        mining_algo: mining_algo,
        location: location,
        triggered: triggered
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
      })
    )
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

export const removeMiners = miner_id => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/remove_miner/`,
      {
        miner_id: miner_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.MINERS_REMOVED }))
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

export const resetMinerStatus = () => {
  return {
    type: types.RESET_MINER_STATUS
  };
};

export const getErrorStatus = err => {
  return {
    type: types.GET_STATUS_CODE,
    network: (err.response || {}).status
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

export const loginPage = () => {
  return {
    type: types.LOGIN_PAGE
  };
};

export const signUpPage = () => {
  return {
    type: types.SIGNUP_PAGE
  };
};

export const marketplacePage = () => {
  return {
    type: types.MARKETPLACE_PAGE
  };
};

export const marketHistoryPage = () => {
  return {
    type: types.MARKETHISTORY_PAGE
  };
};

export const myProfilePage = () => {
  return {
    type: types.MYPROFILE_PAGE
  };
};

export const passwordResetPage = () => {
  return {
    type: types.PASSWORD_RESET_PAGE
  };
};

export const accountActivationPage = () => {
  return {
    type: types.ACCOUNT_ACTIVATION_PAGE
  };
};

export const resetPage = () => {
  return {
    type: types.RESET_PAGE
  };
};

export const notFoundPage = () => {
  return {
    type: types.NOT_FOUND_PAGE
  };
};

export const logOutPage = () => {
  return {
    type: types.LOGOUT_PAGE
  };
};

export const termsOfUsePage = () => {
  return {
    type: types.TERMS_OF_USE_PAGE
  };
};

export const newsPage = () => {
  return {
    type: types.NEWS_PAGE
  };
};

export const sellPage = () => {
  return {
    type: types.SELL_PAGE
  };
};

export const aboutUsPage = () => {
  return {
    type: types.ABOUT_US_PAGE
  };
};

export const referralPage = () => {
  return {
    type: types.REFERRAL_PAGE
  };
};

//////// PROFILE ACTIONS /////////////////////////////

export const getCurrentProfile = () => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(`${apiurl}/user_info/`, { cancelToken: source.token })
    .then(res => dispatch({ type: types.GET_PROFILE, payload: res.data }))
    .catch(err => {
      dispatch({
        type: types.GET_STATUS_CODE,
        payload: (err.response || {}).status
      });
    });
};

export const clearCurrentProfile = () => {
  return {
    type: types.CLEAR_CURRENT_PROFILE
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
  discount_code,
  limit_price
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/bid_make/`,
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
        discount_code: discount_code,
        limit_price: limit_price
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
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
    }
    )
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

export const getBids = (number) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_bids/?page=${number}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
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

export const getBidInfo = (
  bid_id
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_bids/?bid_id=${bid_id}`,
      {
        bid_id: bid_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
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

export const getHashrateInfo = idnumber => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
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
          "X-CSRFToken": csrftoken
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

export const getHashrateHistory = idnumber => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_hashrate_info/?offer_take_id=${idnumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
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

export const getBidHashrateChart = idnumber => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
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
          "X-CSRFToken": csrftoken
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

///// GET STATS ///////////////////////////////////

export const getStats = () => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/get_stats/`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.GET_STATS_DATA,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

/////// STRATUM FORM ////////////////////////////////

export const getStratumList = () => dispatch => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .get(
      `${apiurl}/stratum_get/`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
        dispatch({
          type: types.GET_STRATUM_LIST,
          payload: res.data
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const addStratumInfo = (
  tag,
  mining_algo,
  host,
  port,
  username,
  password
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/stratum_add/`,
      {
        tag: tag,
        mining_algo: mining_algo,
        host: host,
        port: port,
        username: username,
        password: password
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res =>
      dispatch({
        type: types.CLEAR_ERRORS_SHOW_ALERT
      })
    )
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

export const removeStratumInfo = stratum_id => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/stratum_remove/`,
      {
        stratum_id: stratum_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.STRATUM_REMOVED }))
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

export const resetStratumStatus = () => {
  return {
    type: types.RESET_STRATUM_STATUS
  };
};

///////// EDIT BIDS ////////////////////////////////////////

export const editBids = (bid_id, host, port, username, password) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/bid_edit/`,
      {
        bid_id: bid_id,
        host: host,
        port: port,
        username: username,
        password: password
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.CLEAR_ERRORS_SHOW_ALERT }))
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

///////// EDIT OFFERS ////////////////////////////////////////

export const editOffers = (offer_id, host, port, username, password) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/offer_edit/`,
      {
        offer_id: offer_id,
        host: host,
        port: port,
        username: username,
        password: password
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.CLEAR_ERRORS_SHOW_ALERT }))
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

///////// FIAT ORDER ////////////////////////////////////////

export const fiatOrder = (mining_algo, email, name_or_company, phone_number, duration_days, hashrate_fiat, hashrate_units_fiat) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/email_fiat_purchase/`,
      {
        mining_algo: mining_algo,
        email: email,
        name_or_company: name_or_company,
        phone_number: phone_number,
        duration_days: duration_days,
        hashrate: hashrate_fiat,
        hashrate_units: hashrate_units_fiat
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => dispatch({ type: types.CLEAR_ERRORS_FIAT_FORM }))
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

///////////// SET BTC ADDRESS /////////////////////////

export const setBTCAddress = (
  address
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/withdrawal_address_set/`,
      {
        address: address
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({ type: types.SET_PAYMENT_ADDRESS });
    }
    )
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

///////////// CANCEL INVOICE /////////////////////////

export const cancelInvoice = (
  bid_id
) => dispatch => {
  const csrftoken = getCookie(`${csrfcookie}`);
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel("ERROR: Timeout");
  }, TIMEOUT_DURATION);
  return axios
    .post(
      `${apiurl}/bid_cancel/`,
      {
        bid_id: bid_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        }
      },
      { cancelToken: source.token }
    )
    .then(res => {
      dispatch({ type: types.CLEAR_ERRORS_SHOW_ALERT });
    }
    )
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