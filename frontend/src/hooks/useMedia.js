import { useState, useEffect } from 'react';
import { api } from '../services/api'; // <-- export nommé

export function useMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('uploaded_at');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = { ...filters, sort };
      const res = await api.getMedia(params); // <-- utiliser api
      setMedia(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file, extra = {}) => {
    const res = await api.uploadMedia(file, extra);
    setMedia(prev => [res, ...prev]);
    return res;
  };

  const deleteMedia = async (id) => {
    await api.deleteMedia(id);
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  useEffect(() => { fetchMedia(); }, [filters, sort]);

  return { media, loading, fetchMedia, setFilters, setSort, uploadMedia, deleteMedia };
}
