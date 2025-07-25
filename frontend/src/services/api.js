import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your Django backend URL
});

// Add a request interceptor to include the token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;