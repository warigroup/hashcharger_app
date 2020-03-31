import {
  REDIRECT_MESSAGE,
  NOT_FOUND_MESSAGE,
  CANT_TAKE_OWN_OFFER,
  NULL_TOAST
} from "../actions/types";

const initialState = {
  message: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REDIRECT_MESSAGE:
      return {
        message: "redirect"
      };
    case NOT_FOUND_MESSAGE:
      return {
        message: "notfound"
      };
    case CANT_TAKE_OWN_OFFER:
      return {
        message: "canttake"
      };
    case NULL_TOAST:
      return {
        message: null
      };
    default:
      return state;
  }
}
