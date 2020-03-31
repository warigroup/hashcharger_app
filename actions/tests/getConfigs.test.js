import configureStore from 'redux-mock-store';
import nock from 'nock';
import { getConfigs } from '../warihashApiCalls';
import * as types from '../types';
import { apiurl } from '../../settings';
import ReduxThunk from 'redux-thunk';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http')

describe("test getConfigs API call function", function () {
  ///// refresh nock per each test ////////
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(/^(127\.0\.0\.1|localhost)/);
  });
  afterEach((done) => {
    nock.cleanAll()
    done()
  });

  it('dispatches GET_CONFIGS_DATA if API call is successful', () => {
    const mockedUrl = apiurl;
    nock(mockedUrl)
      .get('/get_configs/')
      .reply(201, {res: "some data"});

    const expectedActions = [
      { payload: {res: "some data"}, type: types.GET_CONFIGS_DATA }
    ];
    const middlewares = [ReduxThunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    return store.dispatch(getConfigs())
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
});