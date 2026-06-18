import axios from 'axios';

// Backend URL configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Tumhara backend server port
});

// Interceptor: Har request bhejne se pehle check karega agar token hai toh attach kar dega
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
