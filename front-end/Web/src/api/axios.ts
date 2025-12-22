import axios from "axios";
import qs from 'qs';

const api = axios.create({
  baseURL: "http://localhost:3000", // URL backend
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'repeat', 
    }),
});

export default api;
