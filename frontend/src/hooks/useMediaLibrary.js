import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../utils/constants';

export function useMediaLibrary() {
  const [media, setMedia] = useState([]);
  const [shootings, setShootings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    mediaType: 'all',
    shootingId: null,
    isFavorite: null,
    isUsed: null,
    sortBy: 'uploadedAt',
    sortOrder: 'DESC'
  });

  // Fetch media
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/media?${params}`);
      if (!response.ok) throw new Error('Failed to fetch media');
      
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch shootings
  const fetchShootings = async () => {
    try {
      const response = await fetch(`${API_URL}/media/shootings/list`);
      if (!response.ok) throw new Error('Failed to fetch shootings');
      
      const data = await response.json();
      setShootings(data);
    } catch (error) {
      console.error('Error fetching shootings:', error);
      setShootings([]);
    }
  };

  // Upload media
  const uploadMedia = async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const newMedia = await response.json();
      setMedia([newMedia, ...media]);
      return newMedia;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Update media metadata
  const updateMedia = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Update failed');
      
      const updatedMedia = await response.json();
      setMedia(media.map(m => m.id === id ? updatedMedia : m));
      return updatedMedia;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  };

  // Delete media
  const deleteMedia = async (id) => {
    try {
      const response = await fetch(`${API_URL}/media/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete failed');
      
      setMedia(media.filter(m => m.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  // Create shooting
  const createShooting = async (name, description = '') => {
    try {
      const response = await fetch(`${API_URL}/media/shootings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) throw new Error('Failed to create shooting');
      
      const newShooting = await response.json();
      setShootings([...shootings, newShooting]);
      return newShooting;
    } catch (error) {
      console.error('Create shooting error:', error);
      throw error;
    }
  };

  // Delete shooting
  const deleteShooting = async (id) => {
    try {
      const response = await fetch(`${API_URL}/media/shootings/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete failed');
      
      setShootings(shootings.filter(s => s.id !== id));
    } catch (error) {
      console.error('Delete shooting error:', error);
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    fetchShootings();
  }, []);

  return {
    media,
    shootings,
    loading,
    filters,
    setFilters,
    fetchMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    createShooting,
    deleteShooting
  };
}