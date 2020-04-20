import { PAYMENT_INFO, CLEAR_PAYMENT_INFO, SET_OLD_INVOICE_ID } from "../actions/types";

const initialState = {
    payment_address: "",
    payment_amount: "",
    bid_id: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PAYMENT_INFO:
      return action.payload;
    case SET_OLD_INVOICE_ID:
      return { 
        bid_id: action.payload[0]
      };
    case CLEAR_PAYMENT_INFO:
      return {
        payment_address: "",
        payment_amount: "",
        bid_id: undefined
      };
    default:
      return state;
  }
}
