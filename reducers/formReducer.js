import { FORM_SUBMITTED, ENABLE_NAVIGATION } from "../actions/types";

const initialState = {
  blocknav: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FORM_SUBMITTED:
      return {
        blocknav: "block"
      };
    case ENABLE_NAVIGATION:
      return {
        blocknav: "enable"
      };
    default:
      return state;
  }
}
