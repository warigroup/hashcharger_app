import configureStore from 'redux-mock-store';
import nock from 'nock';
import { registerUser } from '../warihashApiCalls';
import * as types from '../types';
import { apiurl } from '../../settings';
import ReduxThunk from 'redux-thunk';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http')

describe("test user registration", function () {
  ///// refresh nock per each test ////////
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(/^(127\.0\.0\.1|localhost)/);
  });
  afterEach((done) => {
    nock.cleanAll()
    done()
  });

  it('dispatches GET_ERRORS and GET_STATUS_CODE if activation fails', () => {
     /// set up nock API request ///////
    const mockedUrl = apiurl;
    const headers = {
      'Authorization': 'Bearer someAccessToken',
    };
    /// create fake API response with 400 network code /////////////
    nock(mockedUrl, {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .post('/auth/users/', { username: "testUser", email: "tester@test.com", password: "234234agag" },
        { 'Access-Control-Allow-Origin': apiurl })
      .matchHeader('Authorization', headers['Authorization'])
      .reply(400, {data: "invalid"})
    /// set expected redux state based on fake API response /////  
    const expectedActions = [
      { type: types.GET_ERRORS },
      { type: types.GET_STATUS_CODE }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const username = "testUser";
    const email = "tester@test.com";
    const password = "234234agag";

    return store.dispatch(registerUser(username, email, password))
      .then(() => { // return of async actions. check if the dispatched action matches the expected action.
        expect(store.getActions()).toEqual(expectedActions)
      })
  });

  it('dispatches CLEAR_ERRORS_SHOW_ALERT if registration is successful', () => {
    const mockedUrl = apiurl;
    const username = "testUser";
    const email = "tester@test.com";
    const password = "234234agag";

    nock(mockedUrl)
      .post('/auth/users/', { username: username, email: email, password: password },
        { 'Access-Control-Allow-Origin': apiurl })
      .reply(204, {response: "successful"});

    const expectedActions = [
      { type: types.CLEAR_ERRORS_SHOW_ALERT }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    return store.dispatch(registerUser(username, email, password))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
});