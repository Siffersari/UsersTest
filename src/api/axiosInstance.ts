import axios from 'axios';
import { logout } from '../services/userService';

const credentials = btoa("BomaPortalClient:cbfbd0ab-2876-442b-a3c8-8aed9632ba83");

const axiosInstance = axios.create({
  baseURL: 'https://kcb-boma-yangu-backend-kcb-boma-yangu.apps.dev.aro.kcbgroup.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${credentials}`
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logout(); 
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


