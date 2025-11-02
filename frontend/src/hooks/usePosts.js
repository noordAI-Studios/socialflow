// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { STATUSES } from '../utils/constants';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Charger les posts
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
      alert('Erreur lors du chargement des posts');
    } finally {
      setLoading(false);
    }
  };

  // Créer un post
  const createPost = async (postData) => {
    setLoading(true);
    try {
      const newPost = await api.createPost(postData);
      setPosts([newPost, ...posts]);
      await loadPosts(); // Recharger pour synchroniser
      return newPost;
    } catch (error) {
      console.error('Erreur création post:', error);
      alert('Erreur lors de la création du post');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un post
  const updatePost = async (id, postData) => {
    setLoading(true);
    try {
      const updatedPost = await api.updatePost(id, postData);
      setPosts(posts.map(p => p.id === id ? updatedPost : p));
      await loadPosts(); // Recharger pour synchroniser
      return updatedPost;
    } catch (error) {
      console.error('Erreur mise à jour post:', error);
      alert('Erreur lors de la mise à jour du post');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un post
  const deletePost = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return;
    }

    setLoading(true);
    try {
      await api.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erreur suppression post:', error);
      alert('Erreur lors de la suppression du post');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour la date d'un post (pour le calendrier)
  const updatePostDate = async (id, publishDate) => {
    try {
      await api.updatePostDate(id, publishDate);
      setPosts(posts.map(p => 
        p.id === id ? { ...p, publishDate } : p
      ));
    } catch (error) {
      console.error('Erreur mise à jour date:', error);
      alert('Erreur lors du déplacement du post');
    }
  };

  // Filtrer et trier les posts
  useEffect(() => {
    let filtered = [...posts];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.caption && post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(post => post.status === filterStatus);
    }

    // Filtre plateforme
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(post => post.platform === filterPlatform);
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishDate || '2099-12-31') - new Date(a.publishDate || '2099-12-31');
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'status') {
        return STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status);
      }
      return 0;
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, filterStatus, filterPlatform, sortBy]);

  // Charger au montage
  useEffect(() => {
    loadPosts();
  }, []);

  return {
    posts,
    filteredPosts,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPlatform,
    setFilterPlatform,
    sortBy,
    setSortBy,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
    updatePostDate
  };
};