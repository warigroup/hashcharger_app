import axios from "axios";

const setAuthToken = tokenstring => {
  if (tokenstring) {
    const Value = "Token " + tokenstring;
    // Apply to every request. add token to header for accessing protect pages.
    axios.defaults.headers.common["Authorization"] = Value;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
