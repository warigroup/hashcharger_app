import {
  CLEAR_CURRENT_PROFILE,
  GET_PROFILE,
  GET_SETTLEMENTS_PROFILE,
  SET_RECENT_INVOICE_ID
} from "../actions/types";

const initialState = {
  profile: {username: "", is_staff: false},
  profile_loaded: false,
  miners: [],
  miners_loaded: false,
  settlements: [],
  recent_invoice_id: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        profile_loaded: true
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: {username: ""},
        profile_loaded: false,
        miners: [],
        miners_loaded: false
      };
    case GET_SETTLEMENTS_PROFILE:
      return {
        ...state,
        settlements: action.payload
      }; 
    case SET_RECENT_INVOICE_ID:
      return {
        ...state,
        recent_invoice_id: action.payload
      }; 
    default:
      return state;
  }
}
