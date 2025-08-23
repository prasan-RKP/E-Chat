import axios from "axios";

// dotenv.config();

export const axiosMessageInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/authmessage`,
  //baseURL: 'http://192.168.126.238:5008/authmessage',
  withCredentials: true,
});
