import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
/// NEXT REDUX WRAPPER ///////
import withRedux from "next-redux-wrapper";
import { initializeStore } from "../store";
import { csrfcookie } from "../utils/cookieNames";
import getCookie from "../utils/getCookie";
import axios from "axios";
import { apiurl } from "../settings";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  ComponentWillUnmount() {
    logoutUser = () => {
      const csrftoken = getCookie(`${csrfcookie}`);
      const instance = axios.create({
        baseURL: `${apiurl}`,
        timeout: TIMEOUT_DURATION
      });
      instance.defaults.withCredentials = true;
      instance.defaults.crossDomain = true;
    
      instance.post(
        "/logout/",
        { [`${csrfcookie}`]: csrftoken },
        {
          headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken }
        }
      );
    };
    
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initializeStore)(MyApp);
