import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const axiosMessageInstance = axios.create({
  baseURL: `${process.env.VITE_BACKEND_URL}/authmessage`,
  //baseURL: 'http://192.168.126.238:5008/authmessage',
  withCredentials: true,
});
