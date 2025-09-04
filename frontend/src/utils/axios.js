import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://zyppy.onrender.com",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("zyppyy-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
