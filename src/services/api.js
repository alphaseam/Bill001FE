import axios from "axios";

// Create an instance of Axios
const api = axios.create({

  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,// fetch the data from backend url
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = (localStorage.getItem("token"));
    console.log("Token from localStorage:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
