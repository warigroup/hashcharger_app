import { SET_STRATUM_HOST_PORT,
    SET_STRATUM_USERNAME_PASS } from "../actions/types";

const initialState = {
  host: "",
  port: "",
  username: "",
  password: "",
  sub_user: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STRATUM_HOST_PORT: 
      return {
        ...state,
        host: action.payload.host,
        port: action.payload.port
      };
    case SET_STRATUM_USERNAME_PASS: 
      return {
        ...state,
        username: action.payload.username,
        sub_user: action.payload.username,
        password: action.payload.password
      };
    default:
        return state;
    };
};
