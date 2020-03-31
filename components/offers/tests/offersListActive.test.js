import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import OffersListActive from "../OffersListActive";
import thunk from 'redux-thunk';
//// mock Next.js prefetch routes ////
import Router from 'next/router';
const mockedRouter = { push: () => { }, prefetch: () => { } }
Router.router = mockedRouter
//// create mocked redux store ////////
const mockStore = configureMockStore([thunk]);

describe('OffersListActive component', () => {
    /// set fake store for redux states ///////
    let store;
    let props = {
        tableitems: [],
        updating: false,
        unit: "M",
        time: "H"
      }
    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuthenticated: true
            },
            profile: {
                profile: {
                    username: "fakeUsername111",
                    is_staff: false
                }
            },
            configs: {
                server_time: "2019-11-11T22:48:33+00:00"
            },
            miningalgo: {
                algorithm: "sha256d"
            },
            errors: {}, 
            network: {},
            hashrate: {
                times: {
                    fakedata: ""
                }
            }
        });
    });
    it('renders properly with fake props and mocked redux state.', () => {
        const wrapper = mount(
            <Provider store={store}>
                <OffersListActive {...props}/>
            </Provider>
        );
        expect(wrapper.find(OffersListActive).length).to.equal(1);
        expect(wrapper.find('table').length).to.equal(1);
        expect(wrapper.find('thead').length).to.equal(1);
        expect(wrapper.find('tbody').length).to.equal(1);
        expect(wrapper.find('.tablesortbtn').length).to.equal(5);
        expect(wrapper.find('.board').length).to.equal(1);
    });
});