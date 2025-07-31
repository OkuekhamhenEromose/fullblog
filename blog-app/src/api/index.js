import axios from 'axios';
import { getCookie } from '../utils/cookies'

const API = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your Django backend URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const csrfToken = getCookie('csrftoken')
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export default API;