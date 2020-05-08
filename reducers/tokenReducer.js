import { SET_TOKEN } from "../actions/types";
  
  const initialState = {
    value: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_TOKEN: 
        return {
            value: action.payload
        }
      default:
        return state;
    }
  }
  
