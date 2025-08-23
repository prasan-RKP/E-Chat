import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/auth`,

  // for mobile testing
  //baseURL: 'http://192.168.126.238:5008/auth',
  withCredentials: true,
});
