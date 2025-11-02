// src/services/api.js
import { API_URL } from '../utils/constants';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erreur API');
  }
  return response.json();
};

export const api = {
  // Posts
  getPosts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/posts?${params}`);
    return handleResponse(response);
  },

  getPost: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    return handleResponse(response);
  },

  createPost: async (postData) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return handleResponse(response);
  },

  updatePost: async (id, postData) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return handleResponse(response);
  },

  deletePost: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  updatePostDate: async (id, publishDate) => {
    const response = await fetch(`${API_URL}/posts/${id}/date`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publishDate })
    });
    return handleResponse(response);
  },

  // Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await fetch(`${API_URL}/upload-multiple`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  // Export
  exportCSV: () => {
    window.open(`${API_URL}/export/csv`, '_blank');
  }
};