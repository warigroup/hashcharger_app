import { SET_SUBUSER } from '../actions/types';

const initialState = {
	value: undefined
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_SUBUSER:
			return { value: action.payload };
		default:
			return state;
	}
}
