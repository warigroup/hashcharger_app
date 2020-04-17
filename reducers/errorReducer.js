import {
  CLEAR_ERRORS_SHOW_ALERT,
  CLEAR_ERRORS_FIAT_FORM,
  CLEAR_ALERT,
  GET_ERRORS,
  RESET_ERRORS,
  CLEAR_ERRORS_ORDER_CANCEL,
  ORDER_CANCEL_FAIL,
  GET_ERRORS_CANCEL_OFFER
} from "../actions/types";

const initialState = {
  errors: null,
  alertnow: null,
  cancelfail: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS_SHOW_ALERT:
      return {
        alertnow: "alertnow",
        cancelfail: null
      };
    case CLEAR_ERRORS_FIAT_FORM:
      return {
        alertnow: "fiat_form_submitted",
        cancelfail: null
      };
    case CLEAR_ERRORS_ORDER_CANCEL:
      return {
        alertnow: "ordercancel",
        cancelfail: null
      };
    case ORDER_CANCEL_FAIL:
      return {
        errors: action.payload,
        cancelfail: "cancelfail"
      };
    case CLEAR_ALERT:
      return {
        alertnow: null,
        cancelfail: null
      };
    case RESET_ERRORS:
      return {
        errors: null,
        alertnow: null
      };
    case GET_ERRORS_CANCEL_OFFER:
      return {
        errors: action.payload
      };
    default:
      return state;
  }
}
