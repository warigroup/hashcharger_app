import { MINERS_REMOVED, RESET_MINER_STATUS } from "../actions/types";

const initialState = {
  miners_status: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MINERS_REMOVED:
      return {
        miners_status: "removed"
      };
    case RESET_MINER_STATUS:
      return {
        miners_status: ""
      };
    default:
      return state;
  }
}
