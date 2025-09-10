import axios from "axios";

// dotenv.config();

export const axiosMessageInstance = axios.create({
  baseURL: `https://chat-io-bjln.onrender.com/authmessage`,
  //baseURL: 'http://192.168.126.238:5008/authmessage',
  withCredentials: true,
});
