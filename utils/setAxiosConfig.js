import axios from "axios";

const setAxiosConfig = () => {
  axios.defaults.withCredentials = true;
};

export default setAxiosConfig;
