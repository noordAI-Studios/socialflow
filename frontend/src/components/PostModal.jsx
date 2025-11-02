// src/components/PostModal.jsx
import React, { useState, useEffect } from 'react';
import { MediaUploader } from './MediaUploader';
import { PLATFORMS, STATUSES } from '../utils/constants';

export const PostModal = ({ 
  darkMode, 
  editingPost, 
  onClose, 
  onSubmit,
  loading 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'Instagram',
    caption: '',
    images: [],
    aiPrompt: '',
    status: 'Brouillon',
    publishDate: ''
  });

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        platform: editingPost.platform,
        caption: editingPost.caption || '',
        images: editingPost.images || [],
        aiPrompt: editingPost.aiPrompt || '',
        status: editingPost.status,
        publishDate: editingPost.publishDate || ''
      });
    }
  }, [editingPost]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Le titre est requis');
      return;
    }
    onSubmit(formData);
  };

  const handleImagesChange = (newImages) => {
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardBg} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editingPost ? 'Modifier le post' : 'Nouveau post'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre du post *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Plateforme *</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Statut *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Caption / Texte</label>
              <textarea
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images & Vidéos (max 10)</label>
              <MediaUploader 
                images={formData.images}
                onImagesChange={handleImagesChange}
                darkMode={darkMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prompt IA (SeaArt, etc.)</label>
              <textarea
                value={formData.aiPrompt}
                onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de publication</label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Enregistrement...' : (editingPost ? 'Mettre à jour' : 'Créer')}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className={`px-4 py-2 ${inputBg} hover:opacity-80 rounded-lg transition-opacity`}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};