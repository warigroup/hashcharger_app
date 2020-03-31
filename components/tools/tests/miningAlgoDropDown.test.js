import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import MiningAlgoDropDown from "../MiningAlgoDropDown";
import thunk from 'redux-thunk';
//// mock Next.js prefetch routes ////
import Router from 'next/router';
const mockedRouter = { push: () => {}, prefetch: () => {} }
Router.router = mockedRouter
//// create mocked redux store ////////
const mockStore = configureMockStore([thunk]);

describe('MiningAlgoDropDown component', () => {
  /// set fake store for redux states ///////
  let store;
  beforeEach(() => {
    store = mockStore({
        miningalgo: {
            algorithm: "sha256d"
        }
    });
  });
  it('should render the MiningAlgoDropDown component with mocked states', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MiningAlgoDropDown />
      </Provider>
    );
    expect(wrapper.find(MiningAlgoDropDown).length).to.equal(1);
    // it has one button
    expect(wrapper.find('button').length).to.equal(1);
    // it has four list items
    expect(wrapper.find('li').length).to.equal(4);
  });

});