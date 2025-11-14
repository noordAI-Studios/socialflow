// src/App.js
import React, { useState } from 'react';
import { Header } from './components/Header';
import { PostCard } from './components/PostCard';
import { PostModal } from './components/PostModal';
import { PreviewModal } from './components/PreviewModal';
import { CalendarView } from './components/CalendarView';
import { usePosts } from './hooks/usePosts';
import { api } from './services/api';
import { downloadCSV } from './utils/helpers';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);

  const {
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
    createPost,
    updatePost,
    deletePost,
    updatePostDate
  } = usePosts();

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-100';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const handleNewPost = () => {
    setEditingPost(null);
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handlePreview = (post) => {
    setPreviewPost(post);
    setShowPreview(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, formData);
      } else {
        await createPost(formData);
      }
      setShowModal(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  const handleExportCSV = () => {
    try {
      api.exportCSV();
    } catch {
      // Fallback côté client
      const headers = ['Titre', 'Plateforme', 'Caption', 'Images', 'Prompt IA', 'Statut', 'Date Publication'];
      const rows = filteredPosts.map(post => [
        post.title,
        post.platform,
        post.caption || '',
        (post.images?.length || 0) + ' média(s)',
        post.aiPrompt || '',
        post.status,
        post.publishDate || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      downloadCSV(csvContent, `social-media-export-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handlePostDrop = async (postId, newDate) => {
    await updatePostDate(postId, newDate);
  };

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-200`}>
      {loading && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Chargement...
        </div>
      )}

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPlatform={filterPlatform}
        setFilterPlatform={setFilterPlatform}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onExport={handleExportCSV}
        onNewPost={handleNewPost}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'grid' ? (
          filteredPosts.length === 0 ? (
            <div className={`text-center py-12 ${textSecondary}`}>
              <p className="text-lg">Aucun post trouvé</p>
              <p className="mt-2">Créez votre premier post pour commencer !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  darkMode={darkMode}
                  onEdit={handleEditPost}
                  onDelete={deletePost}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )
        ) : (
          <CalendarView
            posts={filteredPosts}
            darkMode={darkMode}
            onPostDrop={handlePostDrop}
          />
        )}
      </div>

      {showModal && (
        <PostModal
          darkMode={darkMode}
          editingPost={editingPost}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          loading={loading}
        />
      )}

      {showPreview && previewPost && (
        <PreviewModal
          post={previewPost}
          darkMode={darkMode}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default App;