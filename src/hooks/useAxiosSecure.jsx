import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://fintrack-server-three.vercel.app",
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;