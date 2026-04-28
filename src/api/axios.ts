import axios from "axios";

// Create a reusable Axios instance for all API calls
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

export default api;