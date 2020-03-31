import {
  CLEAR_CURRENT_PROFILE,
  GET_PROFILE,
  GET_MINERS_LIST,
  GET_SETTLEMENTS_PROFILE
} from "../actions/types";

const initialState = {
  profile: {username: "", is_staff: false},
  profile_loaded: false,
  miners: [],
  miners_loaded: false,
  settlements: []
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
    case GET_MINERS_LIST:
      return {
        ...state,
        miners: action.payload,
        miners_loaded: true
    };
    case GET_SETTLEMENTS_PROFILE:
      return {
        ...state,
        settlements: action.payload
      }; 
    default:
      return state;
  }
}
