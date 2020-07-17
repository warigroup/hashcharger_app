import { GET_BIDS, GET_BID_INFO, CLEAR_BIDS, RESET_PROFILE_LOADING } from '../actions/types';

const initialState = {
	bids: {
		result: [
			{
				offer_take_ids: ''
			}
		]
	},
	bid_info: {
		result: [{}],
		total_pages: [],
		page: []
	},
	bid_loaded: false
};

const INITIALIZE_BID_INFO = {
	result: [{}],
	total_pages: [],
	page: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_BIDS:
			return { ...state, bids: action.payload, bid_loaded: true };
		case GET_BID_INFO:
			return { ...state, bid_info: action.payload };
		case CLEAR_BIDS:
			return { ...state, bid_info: INITIALIZE_BID_INFO };
		case RESET_PROFILE_LOADING:
			return { ...state, bid_loaded: false };
		default:
			return state;
	}
}
