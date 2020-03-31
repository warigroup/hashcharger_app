import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import StratumForm from "../StratumForm";
import thunk from 'redux-thunk';
//// mock Next.js prefetch routes ////
import Router from 'next/router';
const mockedRouter = { push: () => {}, prefetch: () => {} }
Router.router = mockedRouter
//// create mocked redux store ////////
const mockStore = configureMockStore([thunk]);

describe('StratumForm component', () => {
  /// set fake store for redux states ///////
  let store;
  let props = {
    host: "",
    port: "",
    username: "fakeusername",
    password: ""
  }
  beforeEach(() => {
    store = mockStore({
        errors: {}
    });
  });
  it('should render the StratumForm component with mocked states', () => {
    const wrapper = mount(
      <Provider store={store}>
        <StratumForm {...props}/>
      </Provider>
    );
    expect(wrapper.find(StratumForm).length).to.equal(1);
    // it has four input fields
    expect(wrapper.find('input').length).to.equal(4);
    // it has four input labels
    expect(wrapper.find('label').length).to.equal(4);
    // it has four span tags
    expect(wrapper.find('span').length).to.equal(4);
  });

});