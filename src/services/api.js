import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
    // baseURL: `${VITE_API_BASE_URLs}/api`,
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',// fetch the data from backend 

    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor 
api.interceptors.request.use(
    (config) => {
        console.log(config)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => { return response },
    (error) => { return Promise.reject(error) }

);

export default api;
