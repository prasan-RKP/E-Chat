import axios from "axios";

export const axiosMessageInstance = axios.create({
  baseURL: "http://localhost:5008/authmessage",
  //baseURL: 'http://192.168.146.238:5008/authmessage',
  withCredentials: true,
});
