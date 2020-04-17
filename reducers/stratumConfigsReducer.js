import { SET_STRATUM_HOST,
    SET_STRATUM_PORT,
    SET_STRATUM_USERNAME,
    SET_STRATUM_PASSWORD } from "../actions/types";

const initialState = {
  host: "",
  port: "",
  username: "",
  password: "",
  sub_user: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STRATUM_HOST: 
      return {
        ...state,
        host: action.payload
      };
    case SET_STRATUM_PORT: 
      return {
        ...state,
        port: action.payload
      };
    case SET_STRATUM_USERNAME: 
      return {
        ...state,
        username: action.payload,
        sub_user: action.payload
      };
    case SET_STRATUM_PASSWORD: 
      return {
        ...state,
        password: action.payload
      };
  default:
      return state;
  };
};
