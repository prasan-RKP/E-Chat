import axios from "axios";

export const axiosInstance = axios.create({
  //for production
  baseURL: `https://chat-io-bjln.onrender.com/auth`,

  //for development 
  // baseURL: 'http://localhost:5008/auth',
  // for mobile testing
  //baseURL: 'http://192.168.126.238:5008/auth',
  withCredentials: true,
});
