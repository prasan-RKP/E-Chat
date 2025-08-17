import axios from "axios";

export const axiosPostInstace = axios.create({
    baseURL: 'http://localhost:5008/authpost' ,
    //baseURL: 'http://192.168.126.238:5008/authpost',
    withCredentials: true
})