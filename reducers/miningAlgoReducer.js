import { ALGOCHANGE } from "../actions/types";

const initialState = {
  algorithm: "sha256d"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ALGOCHANGE:
      return {
        algorithm: action.payload
      };
    default:
      return state;
  }
}
