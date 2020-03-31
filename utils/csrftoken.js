import React from "react";
import Cookies from "js-cookie";
import { csrfcookie } from "./cookieNames";
const csrftoken = Cookies.get(`${csrfcookie}`);

const CSRFToken = () => {
  return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
};
export default CSRFToken;
