import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const axiosInstance = axios.create({
  baseURL: `${process.env.VITE_BACKEND_URL}/auth`,

  // for mobile testing
  //baseURL: 'http://192.168.126.238:5008/auth',
  withCredentials: true,
});
