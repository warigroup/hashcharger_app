import {
  LOGIN_PAGE,
  SIGNUP_PAGE,
  MARKETPLACE_PAGE,
  MARKETHISTORY_PAGE,
  MYPROFILE_PAGE,
  PASSWORD_RESET_PAGE,
  TERMS_OF_USE_PAGE,
  ACCOUNT_ACTIVATION_PAGE,
  RESET_PAGE,
  NOT_FOUND_PAGE,
  LOGOUT_PAGE,
  NEWS_PAGE,
  SELL_PAGE
} from "../actions/types";

const initialState = {
  page: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_PAGE:
      return {
        page: "loginpage"
      };
    case SIGNUP_PAGE:
      return {
        page: "signuppage"
      };
    case MARKETPLACE_PAGE:
      return {
        page: "marketplacepage"
      };
    case MARKETHISTORY_PAGE:
      return {
        page: "markethistorypage"
      };
    case MYPROFILE_PAGE:
      return {
        page: "myprofilepage"
      };
    case PASSWORD_RESET_PAGE:
      return {
        page: "passwordresetpage"
      };
    case ACCOUNT_ACTIVATION_PAGE:
      return {
        page: "accountactivationpage"
      };
    case RESET_PAGE:
      return {
        page: "resetpage"
      };
    case NOT_FOUND_PAGE:
      return {
        page: "notfoundpage"
      };
    case LOGOUT_PAGE:
      return {
        page: "logoutpage"
      };
    case TERMS_OF_USE_PAGE:
      return {
        page: "termsofusepage"
      };
    case NEWS_PAGE:
      return {
        page: "newspage"
      };
    case SELL_PAGE:
      return {
        page: "sellpage"
      };
    default:
      return state;
  }
}
