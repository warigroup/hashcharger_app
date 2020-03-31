import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import MarketNav from "../MarketNav";
import thunk from 'redux-thunk';
//// mock Next.js prefetch routes ////
import Router from 'next/router';
const mockedRouter = { push: () => {}, prefetch: () => {} }
Router.router = mockedRouter
//// create mocked redux store ////////
const mockStore = configureMockStore([thunk]);

describe('MarketNav component', () => {
  /// set fake store for redux states ///////
  let store;
  beforeEach(() => {
    store = mockStore({
        nav: {
            page: "markethistorypage"
        }
    });
  });
  it('should render the MarketNav component with mocked states', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MarketNav />
      </Provider>
    );
    /// check if marketplace navigation menu is rendering correctly
    expect(wrapper.find(MarketNav).length).to.equal(1);
    expect(wrapper.find('.marketplacenav')).to.have.lengthOf(2);
    expect(wrapper.find('a')).to.have.lengthOf(2);
  });

});