import API from './index';

export const getPosts = async () => {
  try {
    const response = await API.get('posts/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCategories = async () => {
  try {
    const response = await API.get('categories/');
    return response.data;
  } catch (error) {
    console.log('error fetching categories:', error);
    
    throw error.response?.data || error.message;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await API.post('posts/', postData);
    return response.data;
  } catch (error) {
    console.error('Post creation error:', error.response?.data);
    const errorMessage = error.response?.data?.category?.[0] || error.response?.data?.detail || 'Failed to create post';
    throw new Error(errorMessage);
  }
};

// posts.js
export const updatePost = async (postId, postData) => {
  try {
    const response = await API.put(`/posts/${postId}/`, postData);
    return response.data;
  } catch (error) {
    console.error('Post update error:', error.response?.data);
    throw error.response?.data || error.message;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await API.delete(`/posts/${postId}/`);
    return response.data;
  } catch (error) {
    console.error('Post deletion error:', error.response?.data);
    throw error.response?.data || error.message;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await API.get(`/posts/${postId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error.response?.data);
    throw error.response?.data || error.message;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await API.post(`/posts/${postId}/like/`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const bookmarkPost = async (postId) => {
  try {
    const response = await API.post(`/posts/${postId}/bookmark/`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};