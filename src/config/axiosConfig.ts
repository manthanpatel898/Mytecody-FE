import axios from "axios";

// set base url for axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// set default headers for axios which will be sent with every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
}, (error) => {
  Promise.reject(error);
}
);

// validate each response and if token is expired, logout user
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      console.log('Logout user');
    }
    return Promise.reject(error);
  }
);