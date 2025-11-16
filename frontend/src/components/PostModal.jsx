import React, { useState, useEffect } from 'react';
import { X, Heart, Share, MessageCircle, Star, Instagram, Fan,CloudUpload, LibraryBig } from 'lucide-react';
import MediaUploader from './MediaUploader';
import MediaLibrary from './MediaLibrary';
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

  // ----------------------------
  // ÉTATS
  // ----------------------------

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

  const [mediaSource, setMediaSource] = useState('upload'); 
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // ----------------------------
  // STYLES
  // ----------------------------

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  // ----------------------------
  // INITIALISATION
  // ----------------------------

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        platform: editingPost.platform || 'Instagram',
        caption: editingPost.caption || '',
        images: editingPost.images || [],
        aiPrompt: editingPost.aiPrompt || '',
        status: editingPost.status || 'Brouillon',
        publishDate: editingPost.publishDate || ''
      });
    }
  }, [editingPost]);

  // ----------------------------
  // HANDLERS
  // ----------------------------

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Le titre est requis');
      return;
    }
    onSubmit(formData);
  };

  const handleImagesChange = (images) => {
    updateField('images', images);
  };

  const handleSelectFromLibrary = (media) => {
    const newMedia = {
      imageUrl: media.fileUrl,
      imageData: '',
      mediaType: media.mediaType,
      mediaId: media.id,
      thumbnailUrl: media.thumbnailUrl
    };

    handleImagesChange([...formData.images, newMedia]);
    setShowMediaLibrary(false);
  };

  // ----------------------------
  // PREVIEW INSTAGRAM
  // ----------------------------

  const InstagramPreview = () => (
    <div className={`${cardBg} rounded-xl overflow-hidden border ${borderClass}`}>
      <div className="p-3 flex items-center gap-3 border-b border-gray-700">
        <div className="w-8 h-8 bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-0.5">
          <div className={`w-full h-full ${cardBg} rounded-full`} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">itsvictoriababy</div>
          <div className={`text-xs ${textSecondary}`}>Audio original</div>
        </div>
      </div>

      <div className={`${getAspectRatioClass(previewRatio)} bg-gray-700 relative`}>
        {formData.images.length ? (
          <MediaCarousel images={formData.images} alt="Preview" fullHeight />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={textSecondary}>Aucune image</span>
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className={`${cardBg} p-3`}>
        <div className="flex items-center gap-4 mb-2">
          <button className="text-2xl"><Heart /></button>
          <button className="text-2xl"><MessageCircle /></button>
          <button className="text-2xl"><Share /></button>
          <button className="text-2xl ml-auto"><Star /></button>
        </div>

        <div className="text-sm font-semibold mb-1">1,234 likes</div>

        {formData.caption && (
          <div className="text-sm">
            <span className="font-semibold">itsvictoriababy</span>{' '}
            <span className="wrap-break-word">{formData.caption}</span>
          </div>
        )}

        <div className={`text-xs ${textSecondary} mt-2`}>
          {formData.publishDate
            ? formatDate(formData.publishDate, { day: 'numeric', month: 'long' })
            : 'Maintenant'}
        </div>
      </div>
    </div>
  );

  // ----------------------------
  // PREVIEW FANVUE
  // ----------------------------

  const FanvuePreview = () => (
    <div className={`${cardBg} rounded-xl overflow-hidden border ${borderClass}`}>
      <div className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-purple-600 p-0.5">
          <div className={`w-full h-full ${cardBg} rounded-full`} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">votre_compte</div>
          <div className={`text-xs ${textSecondary}`}>il y a 0 jours</div>
        </div>
      </div>

      {formData.caption && (
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {formData.caption}
          </p>
        </div>
      )}

      <div className={`${getAspectRatioClass(previewRatio)} bg-gray-700`}>
        {formData.images.length ? (
          <MediaCarousel images={formData.images} alt="Preview" fullHeight />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={textSecondary}>Aucune image</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <button className="text-2xl"><Heart /></button>
          <button className="text-2xl"><MessageCircle /></button>
        </div>
        <div className="text-sm font-semibold">101 likes</div>
      </div>
    </div>
  );

  // ----------------------------
  // RENDER
  // ----------------------------

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${cardBg} rounded-lg w-full max-w-6xl my-8 max-h-screen overflow-y-auto`}>
        <div className="p-6">

          {/* TITLE */}
          <h2 className="text-2xl font-semibold mb-6">
            {editingPost ? 'Modifier le post' : 'Nouveau post'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT COLUMN — FORM */}
            <div className="space-y-4">

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass}`}
                />
              </div>

              {/* Plateforme & Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Plateforme *</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => updateField('platform', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass}`}
                  >
                    {PLATFORMS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Statut *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass}`}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Caption</label>
                  <span className={`text-xs ${textSecondary}`}>
                    {formData.caption.length} / 2200
                  </span>
                </div>
                <textarea
                  value={formData.caption}
                  onChange={(e) => updateField('caption', e.target.value)}
                  rows={6}
                  maxLength={2200}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass}`}
                  placeholder="Écrivez votre caption ici..."
                />
              </div>

              {/* MEDIA — Upload / Library */}
              <div>
                <label className="block text-sm font-medium mb-3">Images & Vidéos (max 10)</label>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setMediaSource('upload')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                      mediaSource === 'upload' 
                      ? 'bg-pink-600 text-white flex items-center justify-center gap-2'
                      : `${inputBg}  text-pink-600 flex items-center justify-center gap-2`
                    }`}
                  >
                    <CloudUpload/> Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaSource('library')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                      mediaSource === 'library' 
                                            ? 'bg-pink-600 text-white flex items-center justify-center gap-2'
                      : `${inputBg}  text-pink-600 flex items-center justify-center gap-2`
                    }`}
                  >
                    <LibraryBig /> Bibliothèque
                  </button>
                </div>

                {mediaSource === 'upload' ? (
                  <MediaUploader 
                    images={formData.images}
                    onImagesChange={handleImagesChange}
                    darkMode={darkMode}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaLibrary(true)}
                    className={`w-full p-6 border-2 border-dashed ${borderClass} rounded-lg ${inputBg} flex flex-col items-center gap-2`}
                  >
                    <span className="text-3xl">📚</span>
                    <span className="font-medium">Ouvrir la Media Library</span>
                  </button>
                )}

              </div>

              {/* Prompt IA */}
              <div>
                <label className="block text-sm font-medium mb-2">Prompt IA</label>
                <textarea
                  value={formData.aiPrompt}
                  onChange={(e) => updateField('aiPrompt', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass}`}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date de publication</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => updateField('publishDate', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass}`}
                />
              </div>
            </div>

            {/* RIGHT COLUMN — PREVIEW */}
            <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">

              <label className="block text-sm font-medium mb-3">Preview</label>

              {/* Toggle Plateforme */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('instagram')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    previewPlatform === 'instagram'
                      ? 'bg-pink-600 text-white flex items-center justify-center gap-2'
                      : `${inputBg}  text-pink-600 flex items-center justify-center gap-2`
                  }`}
                >
                <Instagram/>  Instagram
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewPlatform('fanvue')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    previewPlatform === 'fanvue'
                      ? 'bg-pink-600 text-white flex items-center justify-center gap-2'
                      : `${inputBg}  text-pink-600 flex items-center justify-center gap-2`
                  }`}
                >
                  <Fan /> Fanvue
                </button>
              </div>

              {/* Toggle Ratios */}
              <div className="flex gap-2 mb-4">
                {ASPECT_RATIOS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPreviewRatio(value)}
                    className={`flex-1 px-2 py-1 rounded text-xs ${
                      previewRatio === value
                        ? 'bg-blue-600 text-white'
                        : `${inputBg}`
                    }`}
                  >
                    {label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Preview */}
              {previewPlatform === 'instagram'
                ? <InstagramPreview />
                : <FanvuePreview />}
            </div>
          </div>

          {/* BOTTOM BUTTONS */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ${
                loading && 'opacity-50 cursor-not-allowed'
              }`}
            >
              {loading ? 'Enregistrement...' : editingPost ? 'Mettre à jour' : 'Créer'}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-2 ${inputBg} rounded-lg`}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      {/* MEDIA LIBRARY MODAL */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-7xl max-h-[90vh] relative">

            <button
              onClick={() => setShowMediaLibrary(false)}
              className="absolute -top-2 -right-2 z-10 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg"
            >
              ✕
            </button>

            <div className="h-full overflow-auto rounded-lg shadow-2xl">
              <MediaLibrary
                darkMode={darkMode}
                onSelectMedia={handleSelectFromLibrary}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
