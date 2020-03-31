import { STRATUM_REMOVED, RESET_STRATUM_STATUS, GET_STRATUM_LIST } from "../actions/types";

const initialState = {
  stratum_list: [],
  stratum_status: "",
  stratum_loaded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STRATUM_LIST: 
      return {
          stratum_list: action.payload,
          stratum_status: "",
          stratum_loaded: true
      }
    case STRATUM_REMOVED:
      return {
          ...state,
          stratum_status: "removed"
      };
    case RESET_STRATUM_STATUS:
      return {
          ...state,
          stratum_status: ""
      };
    default:
      return state;
  }
}
