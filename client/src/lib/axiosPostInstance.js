import axios from "axios";

export const axiosPostInstace = axios.create({
  baseURL: `https://chat-io-bjln.onrender.com/authpost`,
  //baseURL: 'http://192.168.126.238:5008/authpost',
  //baseURL: 'http://localhost:5008/authpost',
  withCredentials: true,
});
