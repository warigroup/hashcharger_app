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
        host: action.payload[0].host,
        port: action.payload[1].port
      };
    case SET_STRATUM_USERNAME_PASS: 
      return {
        ...state,
        username: action.payload[0].username,
        sub_user: action.payload[0].username,
        password: action.payload[1].password
      };
    default:
        return state;
    };
};
