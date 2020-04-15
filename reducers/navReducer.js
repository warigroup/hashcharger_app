import {
  MARKETPLACE_PAGE,
  ORDER_DETAILS_PAGE,
  INVOICE_PAGE,
  SEARCH_PAGE
} from "../actions/types";

const initialState = {
  page: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MARKETPLACE_PAGE:
      return {
        page: "marketplacepage"
      };
    case SEARCH_PAGE:
      return {
        page: "searchpage"
      };
      case INVOICE_PAGE:
    return {
      page: "invoicepage"
    };
    case ORDER_DETAILS_PAGE:
      return {
        page: "orderdetailspage"
      };
    default:
      return state;
  }
}
