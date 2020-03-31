import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import PaymentRate from "../PaymentRate";
import thunk from 'redux-thunk';
//// mock Next.js prefetch routes ////
import Router from 'next/router';
const mockedRouter = { push: () => {}, prefetch: () => {} }
Router.router = mockedRouter
//// create mocked redux store ////////
const mockStore = configureMockStore([thunk]);

describe('PaymentRate component', () => {
  /// set fake store for redux states ///////
  let store;
  beforeEach(() => {
    store = mockStore({
        configs: {
            payment_vehicle: "Bitcoin",
            price_hash_units: "M",
            price_time_units: "K"
        },
        miningalgo: {
            algorithm: "sha256d"
        }
    });
  });
  it('should render the PaymentRate component with mocked states', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PaymentRate />
      </Provider>
    );
    expect(wrapper.find(PaymentRate).length).to.equal(1);
    // it has one span tag
    expect(wrapper.find('span')).to.have.lengthOf(1);
  });

});