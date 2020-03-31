import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

// const startState = {};
const middlewares = [thunk];
// activate ReduxDev tool in development mode
const reduxDevTools =
  process.env.NODE_ENV === "production"
    ? applyMiddleware(...middlewares)
    : composeWithDevTools(applyMiddleware(...middlewares));

export function initializeStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(reduxDevTools)
  );
}
