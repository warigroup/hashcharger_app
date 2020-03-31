import { PAYMENT_INFO, CLEAR_PAYMENT_INFO } from "../actions/types";

const initialState = {
    payment_address: "",
    payment_amount: "",
    bid_id: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PAYMENT_INFO:
      return action.payload;
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
