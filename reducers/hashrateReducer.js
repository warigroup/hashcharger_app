import { GET_HASHRATE_INFO, CLEAR_HASHRATE_DATA } from '../actions/types';

const initialState = {
	times: [],
	hashrates: [],
	hashrate_units: ''
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_HASHRATE_INFO:
			return action.payload;
		case CLEAR_HASHRATE_DATA:
			return {
				times: [],
				hashrates: [],
				hashrate_units: ''
			};
		default:
			return state;
	}
}
