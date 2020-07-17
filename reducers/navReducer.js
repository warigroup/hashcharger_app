import {
	MARKETPLACE_PAGE,
	INVOICE_PAGE,
	ORDER_HISTORY_PAGE,
	NOT_FOUND_PAGE
} from '../actions/types';

const initialState = {
	page: ''
};

export default function(state = initialState, action) {
	switch (action.type) {
		case MARKETPLACE_PAGE:
			return {
				page: 'marketplacepage'
			};
		case ORDER_HISTORY_PAGE:
			return {
				page: 'orderhistorypage'
			};
		case INVOICE_PAGE:
			return {
				page: 'invoicepage'
			};
		case NOT_FOUND_PAGE:
			return {
				page: 'notfoundpage'
			};
		default:
			return state;
	}
}
