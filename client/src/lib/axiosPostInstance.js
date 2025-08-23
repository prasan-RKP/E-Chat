import axios from "axios";

export const axiosPostInstace = axios.create({
  baseURL: `${process.env.VITE_BACKEND_URL}/authpost`,
  //baseURL: 'http://192.168.126.238:5008/authpost',
  withCredentials: true,
});
