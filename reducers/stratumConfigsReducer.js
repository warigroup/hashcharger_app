import { SET_STRATUM_HOST,
    SET_STRATUM_PORT,
    SET_STRATUM_USERNAME,
    SET_STRATUM_PASSWORD } from "../actions/types";

const initialState = {
  stratum_host: "",
  stratum_port: "",
  stratum_username: "",
  stratum_password: "",
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STRATUM_HOST: 
      return {
        ...state,
        stratum_host: action.payload
      };
    case SET_STRATUM_PORT: 
      return {
        ...state,
        stratum_port: action.payload
      };
    case SET_STRATUM_USERNAME: 
      return {
        ...state,
        stratum_username: action.payload
      };
    case SET_STRATUM_PASSWORD: 
      return {
        ...state,
        stratum_password: action.payload
      };
  default:
      return state;
  };
};
