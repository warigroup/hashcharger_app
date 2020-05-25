import { GET_ESTIMATE } from "../actions/types";

const initialState = {
    data: {
      "data": undefined
    }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ESTIMATE:
      return { ...state, 
        data: action.payload };
    default:
      return state;
  }
}
