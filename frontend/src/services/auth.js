import API from './api';

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('auth/login/', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await API.post('auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = async () => {
  try {
    const response = await API.post('auth/logout/');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await API.get('auth/profile/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await API.put('auth/profile/', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};