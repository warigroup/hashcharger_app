import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
/// NEXT REDUX WRAPPER ///////
import withRedux from "next-redux-wrapper";
import { initializeStore } from "../store";
import Cookies from "js-cookie";
import { sessioncookie, csrfcookie } from "../utils/cookieNames";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  ComponentWillUnmount() {
    Cookies.set(sessioncookie, 'empty', { expires: 0 });
    Cookies.remove(csrfcookie);
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
