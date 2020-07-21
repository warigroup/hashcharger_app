import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import PublicRoute from "../PublicRoute";
import thunk from 'redux-thunk';
//// mock Next.js prefetch routes ////
import Router from 'next/router';
const mockedRouter = { push: () => { }, prefetch: () => { } }
Router.router = mockedRouter
//// create mocked redux store ////////
const mockStore = configureMockStore([thunk]);

describe('PublicRoute component accessed by unauthenticated user', () => {
    /// set fake store for redux states ///////
    let store;
    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuthenticated: false
            },
            profile: {
                profile: {
                    username: "",
                    is_staff: false
                }
            },
            configs: {
                server_time: "2019-11-11T22:48:33+00:00"
            },
            nav: {
                page: "loginpage"
            },
            form: {
                blocknav: "enable"
            }
        });
    });
    it('render', () => {
        const wrapper = mount(
            <Provider store={store}>
                <PublicRoute />
            </Provider>
        );
        expect(wrapper.find(PublicRoute).length).to.equal(1);
    });
});