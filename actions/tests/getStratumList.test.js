import configureStore from 'redux-mock-store';
import nock from 'nock';
import { getStratumList } from '../warihashApiCalls';
import * as types from '../types';
import { apiurl } from '../../settings';
import ReduxThunk from 'redux-thunk';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http')

describe("test getStratumList API call function", function () {
  ///// refresh nock per each test ////////
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(/^(127\.0\.0\.1|localhost)/);
  });
  afterEach((done) => {
    nock.cleanAll()
    done()
  });

  it('dispatches GET_STRATUM_LIST if API call is successful', () => {
    const mockedUrl = apiurl;
    nock(mockedUrl)
      .get('/stratum_get/')
      .reply(201, {res: "fake stratum data"});

    const expectedActions = [
      { payload: {res: "fake stratum data"}, type: types.GET_STRATUM_LIST }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    return store.dispatch(getStratumList())
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
});