import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
    // baseURL: `${VITE_API_BASE_URLs}/api`,
<<<<<<< HEAD
    baseURL: `${import.meta.env.VITE_API_BASE_URL}` || 'http://localhost:3000',// || 'https://api.escuelajs.co/api/v1',// fetch the data from backend 
=======
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.escuelajs.co/api/v1',// fetch the data from backend 

>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor 
api.interceptors.request.use(
    (config) => {
        const token = JSON.stringify(localStorage.getItem('token'));
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
