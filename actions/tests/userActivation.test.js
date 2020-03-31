import configureStore from 'redux-mock-store';
import nock from 'nock';
import { postActivationData } from '../warihashApiCalls';
import * as types from '../types';
import { apiurl } from '../../settings';
import ReduxThunk from 'redux-thunk';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http')

describe("test user activation", function () {
  ///// refresh nock per each test ////////
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(/^(127\.0\.0\.1|localhost)/);
  });
  afterEach((done) => {
    nock.cleanAll()
    done()
  });

  it('dispatches ACTIVATION_FAILED if activation fails', () => {
    /// set up nock API request ///////
    const mockedUrl = apiurl;
    const headers = {
      'Authorization': 'Bearer someAccessToken',
    };

    /// create fake API response with 403 network code /////////////
    nock(mockedUrl, {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .post('/auth/users/activation/', { uid: "testUid", token: "wefwefw" },
        { 'Access-Control-Allow-Origin': apiurl })
      .matchHeader('Authorization', headers['Authorization'])
      .reply(403, { data: "failed" });
    /// set expected redux state based on fake API response /////
    const expectedActions = [
      { type: types.ACTIVATION_FAILED }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const uid = "testUid";
    const token = "wefwefw";

    return store.dispatch(postActivationData(uid, token))
      .then(() => { // return of async actions. check if the dispatched action matches the expected action.
        expect(store.getActions()).toEqual(expectedActions)
      })
  });

  it('dispatches ACTIVATION_SUCCESSFUL if activation is successful', () => {
    const mockedUrl = apiurl;
    const uid = "testUid";
    const token = "wefwefw";
    nock(mockedUrl)
      .post('/auth/users/activation/', { uid: uid, token: token },
        { 'Access-Control-Allow-Origin': apiurl })
      .reply(204, {response: "successful"});

    const expectedActions = [
      { payload: {response: "successful"}, type: types.ACTIVATION_SUCCESSFUL }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    return store.dispatch(postActivationData(uid, token))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
});