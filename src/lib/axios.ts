import axios from "axios";
    const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    });
    const TOKEN_KEY = "auth_token";
    api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    return config;
    });
 export default api;