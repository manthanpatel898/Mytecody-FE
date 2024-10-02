import axios from "axios";
import { toast } from "react-toastify";
import { getItem } from "../utils/localstorage-service";

// Set up the base URL and axios instance
export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Make sure to have this environment variable set up
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
    (config) => {
      const token = getItem("token"); // Retrieve the token from local storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// Interceptor to handle common global errors
http.interceptors.response.use(
  (response) => {
    // If response is successful, return it
    return response;
  },
  (error) => {
    // Handle common error status codes globally
    const status = error?.response?.status;
    if (status === 401) {
      // Handle unauthorized errors
      toast.error("Unauthorized access. Please login again.");
      // Optionally, redirect to login page or perform any logout action
    } else if (status === 500) {
      // Handle server errors
      toast.error("Internal Server Error. Please try again later.");
    } else if (status === 404) {
      // Handle not found errors
      toast.error("Resource not found.");
    } 
    // else if (status) {
    //   // Handle other errors with specific messages from API response
    //   toast.error(
    //     error?.response?.data?.message || "An error occurred. Please try again."
    //   );
    // }
    return Promise.reject(error);
  }
);

/**
 * A generic function to make API requests
 * @param method - HTTP method: get, post, put, delete
 * @param url - API endpoint URL
 * @param data - Request payload (optional)
 * @param showToast - Whether to show toast on success (default is true)
 */
export const makeRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data: any = null,
  showToast: boolean = true
): Promise<any> => {
  return new Promise((resolve, reject) => {
    http[method](url, data)
      .then((response: any) => {
        if (showToast) {
            // toast.success(response.data.message || "Request successful!");
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// ---------------------------------API_ENDPOINTS---------------------------------
export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
};
