import {
   GET_OFFERS,
   GET_OFFER_INFO,
   CLEAR_OFFERS
} from "../actions/types";

const initialState = {
  active_offers: {
    "result": [],
    "total_pages": [],
    "page": []
  },
  offer_info: {
    "result": [{}],
    "total_pages": [],
    "page": []
  },
  offers_loaded: false
};

const INITIALIZE_OFFER_INFO = {
  "result": [{}],
  "total_pages": [],
  "page": []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_OFFERS:
      return {
        ...state,
        active_offers: action.payload,
        offers_loaded: true
      };
    case GET_OFFER_INFO:
      return {
        ...state,
        offer_info: action.payload
      };
    case CLEAR_OFFERS:
      return { ...state, offer_info: INITIALIZE_OFFER_INFO };
    default:
      return state;
  }
}
