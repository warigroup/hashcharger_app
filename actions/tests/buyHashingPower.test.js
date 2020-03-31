import configureStore from 'redux-mock-store';
import nock from 'nock';
import { takeOffer } from '../warihashApiCalls';
import * as types from '../types';
import { apiurl } from '../../settings';
import ReduxThunk from 'redux-thunk';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http')

describe("test buy hashing power function", function () {
  ///// refresh nock per each test ////////
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(/^(127\.0\.0\.1|localhost)/);
  });
  afterEach((done) => {
    nock.cleanAll()
    done()
  });

  it('dispatches GET_ERRORS and GET_STATUS_CODE if buying hashing power fails', () => {
    /// set up nock API request ///////
    const mockedUrl = apiurl;
    /// fake input data
    const headers = {
      'Authorization': 'Bearer someAccessToken',
    };
    const hashrate = "350";
    const hashrate_units = "K";
    const mining_algo = "sha256d";
    const duration = "180";
    const host = "stratum.slushpool.com";
    const port = "8547";
    const username = "someUsername";
    const password = "TTGWFWEFWQ";
    /// create fake API response with 403 network code /////////////
    nock(mockedUrl, {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .post('/bid_make/', {hashrate: hashrate, hashrate_units: hashrate_units, mining_algo: mining_algo,
        duration: duration, host: host, port: port, username: username, password: password},
        { 'Access-Control-Allow-Origin': apiurl })
      .matchHeader('Authorization', headers['Authorization'])
      .reply(403, { data: "failed" });
    /// set expected redux state based on fake API response /////
    const expectedActions = [
      { type: types.GET_ERRORS },
      { type: types.GET_STATUS_CODE }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});

    return store.dispatch(takeOffer(hashrate, hashrate_units, mining_algo, duration, host, port,
        username, password))
      .then(() => { // return of async actions. check if the dispatched action matches the expected action.
        expect(store.getActions()).toEqual(expectedActions)
      })
  });

 
  it('dispatches PAYMENT_INFO and CLEAR_ERRORS_SHOW_ALERT if buying hashing power is successful', () => {
    const mockedUrl = apiurl;
    /// fake input data
    const hashrate = "350";
    const hashrate_units = "K";
    const mining_algo = "sha256d";
    const duration = "180";
    const host = "stratum.slushpool.com";
    const port = "8547";
    const username = "someUsername";
    const password = "TTGWFWEFWQ";
    nock(mockedUrl)
      .post('/bid_make/', {hashrate: hashrate, hashrate_units: hashrate_units, mining_algo: mining_algo,
    duration: duration, host: host, port: port, username: username, password: password},
        { 'Access-Control-Allow-Origin': apiurl })
      .reply(200, {res: "fake_payment_address" });

    const expectedActions = [
      { payload:{ res: "fake_payment_address"}, type: types.PAYMENT_INFO },
      { type: types.CLEAR_ERRORS_SHOW_ALERT }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    return store.dispatch(takeOffer(hashrate, hashrate_units, mining_algo, duration, host, port,
        username, password))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

});