import { GET_ESTIMATE } from "../actions/types";

const initialState = {
    price: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ESTIMATE:
      return { price: action.payload };
    default:
      return state;
  }
}
