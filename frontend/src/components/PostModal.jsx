// src/components/PostModal.jsx
import React, { useState, useEffect } from 'react';
import MediaUploader from './MediaUploader'; // <-- default import
import { MediaCarousel } from './MediaCarousel';
import { PLATFORMS, STATUSES, ASPECT_RATIOS } from '../utils/constants';
import { getAspectRatioClass, formatDate } from '../utils/helpers';

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

  const [previewPlatform, setPreviewPlatform] = useState('instagram');
  const [previewRatio, setPreviewRatio] = useState('1:1');

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

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

  // Compteur de caractères
  const captionLength = formData.caption.length;
  const maxCaptionLength = 2200;
  const captionPercentage = (captionLength / maxCaptionLength) * 100;
  const captionColor = captionLength > maxCaptionLength ? 'text-red-500' : 
                       captionLength > maxCaptionLength * 0.9 ? 'text-orange-500' : 
                       textSecondary;

  // Preview Instagram
  const InstagramPreview = () => (
    <div className={`${cardBg} rounded-xl overflow-hidden border ${borderClass}`}>
      <div className="p-3 flex items-center gap-3 border-b border-gray-700">
        <div className="w-8 h-8 bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-0.5">
          <div className={`w-full h-full ${cardBg} rounded-full`}></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">votre_compte</div>
          <div className={`text-xs ${textSecondary}`}>{formData.platform}</div>
        </div>
      </div>

      <div className={`${getAspectRatioClass(previewRatio)} relative bg-gray-700`}>
        {formData.images.length > 0 ? (
          <MediaCarousel images={formData.images} alt="Preview" fullHeight={true} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={textSecondary}>Aucune image</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xl">❤️</span>
          <span className="text-xl">💬</span>
          <span className="text-xl">📤</span>
          <span className="text-xl ml-auto">🔖</span>
        </div>
        <div className="text-sm font-semibold mb-1">1,234 likes</div>
        {formData.caption && (
          <div className="text-sm">
            <span className="font-semibold">votre_compte</span>{' '}
            <span className="wrap-break-word">{formData.caption}</span>
          </div>
        )}
        <div className={`text-xs ${textSecondary} mt-2`}>
          {formData.publishDate ? formatDate(formData.publishDate, { day: 'numeric', month: 'long' }) : 'Maintenant'}
        </div>
      </div>
    </div>
  );

  // Preview Fanvue
  const FanvuePreview = () => (
    <div className={`${cardBg} rounded-xl overflow-hidden border ${borderClass}`}>
      <div className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-purple-600 p-0.5">
          <div className={`w-full h-full ${cardBg} rounded-full`}></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">votre_compte</div>
          <div className={`text-xs ${textSecondary}`}>il y a 0 jours</div>
        </div>
      </div>

      {formData.caption && (
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{formData.caption}</p>
        </div>
      )}

      <div className={`${getAspectRatioClass(previewRatio)} relative bg-gray-700`}>
        {formData.images.length > 0 ? (
          <MediaCarousel images={formData.images} alt="Preview" fullHeight={true} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={textSecondary}>Aucune image</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xl">❤️</span>
          <span className="text-xl">💬</span>
        </div>
        <div className="text-sm font-semibold">101 likes</div>
      </div>
    </div>
  );

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div className={`${cardBg} rounded-lg w-full max-w-6xl my-8 max-h-screen overflow-y-auto`}>
    <div className="p-6">

          <h2 className="text-2xl font-semibold mb-6">
            {editingPost ? 'Modifier le post' : 'Nouveau post'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire à gauche */}
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Caption / Texte</label>
                  <span className={`text-xs ${captionColor}`}>
                    {captionLength} / {maxCaptionLength}
                  </span>
                </div>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows={6}
                  maxLength={maxCaptionLength}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    captionLength > maxCaptionLength ? 'border-red-500' : ''
                  }`}
                  placeholder="Écrivez votre caption ici..."
                />
                {/* Barre de progression */}
                <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      captionLength > maxCaptionLength ? 'bg-red-500' : 
                      captionLength > maxCaptionLength * 0.9 ? 'bg-orange-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(captionPercentage, 100)}%` }}
                  />
                </div>
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
            </div>

            {/* Preview à droite */}
            <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <div>
                <label className="block text-sm font-medium mb-3">Preview en temps réel</label>
                
                {/* Toggle Plateforme */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPreviewPlatform('instagram')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      previewPlatform === 'instagram' 
                        ? 'bg-pink-600 text-white' 
                        : `${inputBg} hover:opacity-80`
                    }`}
                  >
                    📷 Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewPlatform('fanvue')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      previewPlatform === 'fanvue' 
                        ? 'bg-pink-600 text-white' 
                        : `${inputBg} hover:opacity-80`
                    }`}
                  >
                    💎 Fanvue
                  </button>
                </div>

                {/* Toggle Ratio */}
                <div className="flex gap-2 mb-4">
                  {ASPECT_RATIOS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPreviewRatio(value)}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        previewRatio === value 
                          ? 'bg-blue-600 text-white' 
                          : `${inputBg} hover:opacity-80`
                      }`}
                    >
                      {label.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Preview */}
                {previewPlatform === 'instagram' ? <InstagramPreview /> : <FanvuePreview />}
              </div>
            </div>
          </div>

          {/* Boutons en bas */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
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
              className={`px-6 py-2 ${inputBg} hover:opacity-80 rounded-lg transition-opacity`}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};