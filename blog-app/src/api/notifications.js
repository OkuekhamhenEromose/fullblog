import API from './index';

export const getNotifications = async () => {
  try {
    const response = await API.get('/notifications/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getNotificationCount = async () => {
  try {
    const response = await API.get('/notifications/count/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};