import { TIMEOUT_ERROR, TIMEOUT_RESET } from '../actions/types';

const initialState = {
	message: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case TIMEOUT_RESET:
			return {
				message: null
			};
		case TIMEOUT_ERROR:
			return {
				message: 'ERROR: Timeout'
			};
		default:
			return state;
	}
}
