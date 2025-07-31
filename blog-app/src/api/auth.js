import { getCookie } from '../utils/cookies';
import API from './index';

export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register/', userData, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });
    return response.data ;
  } catch (error) {
    // Return the full error response for better debugging
    // return { 
    //   success: false, 
    //   error: error.response?.data || { message: 'Registration failed' } 
    // };
    throw error.response?.data || {error: 'Registration failed'}
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login/', credentials,{
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
    },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || {error: 'Login failed'};
  }
};

export const logout = async () => {
  try {
    const response = await API.post('/auth/logout/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDashboard = async () => {
  try {
    const response = await API.get('/auth/dashboard/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await API.put('/auth/profile/', profileData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};