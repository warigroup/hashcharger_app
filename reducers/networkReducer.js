import { GET_STATUS_CODE, CLEAR_NETWORK_CODE } from '../actions/types';

const initialState = {
	networkstatus: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_STATUS_CODE:
			return {
				networkstatus: action.payload
			};
		case CLEAR_NETWORK_CODE:
			return {
				networkstatus: null
			};
		default:
			return state;
	}
}
