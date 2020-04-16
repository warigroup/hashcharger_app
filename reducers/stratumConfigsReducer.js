import { SET_USER_CONFIGS } from "../actions/types";

const initialState = {
  stratum_host: "",
  stratum_port: "",
  stratum_username: "",
  stratum_password: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_CONFIGS: 
      return {
        stratum_host: action.payload.host,
        stratum_port: action.payload.port,
        stratum_username: action.payload.username,
        stratum_password: action.payload.password
      };
  default:
      return state;
  };
};
