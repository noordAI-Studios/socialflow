import React, { useState } from 'react';
import { Upload, Search, Filter, Grid, List, Folder, Star, Image as ImageIcon, Video } from 'lucide-react';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import MediaGrid from './MediaLibrary/MediaGrid';
import MediaDetailModal from './MediaLibrary/MediaDetailModal';
import MediaUploadZone from './MediaLibrary/MediaUploadZone';

export default function MediaLibrary({ darkMode = true, onSelectMedia = null }) {
  const {
    media,
    shootings,
    loading,
    filters,
    setFilters,
    uploadMedia,
    deleteMedia,
    updateMedia
  } = useMediaLibrary();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const handleUpload = async (files) => {
    try {
      for (const file of files) {
        await uploadMedia(file);
      }
      setShowUpload(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Erreur lors de l\'upload');
    }
  };

  const handleMediaClick = (media) => {
    if (onSelectMedia) {
      onSelectMedia(media);
    } else {
      setSelectedMedia(media);
    }
  };

  const stats = {
    total: media.length,
    images: media.filter(m => m.mediaType === 'image').length,
    videos: media.filter(m => m.mediaType === 'video').length,
    favorites: media.filter(m => m.isFavorite).length,
    unused: media.filter(m => !m.usageCount || m.usageCount === 0).length
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} ${textClass}`}>
      {/* Header */}
      <div className={`${cardBg} border-b ${borderClass} sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">📚 Media Library</h1>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-opacity ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : `${inputBg} hover:opacity-80`
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-opacity ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : `${inputBg} hover:opacity-80`
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Upload size={18} />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className={`${inputBg} rounded-lg p-3 border ${borderClass}`}>
              <div className={`text-xs ${textSecondary} mb-1`}>Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className={`${inputBg} rounded-lg p-3 border ${borderClass}`}>
              <div className={`text-xs ${textSecondary} mb-1 flex items-center gap-1`}>
                <ImageIcon size={12} /> Images
              </div>
              <div className="text-2xl font-bold">{stats.images}</div>
            </div>
            <div className={`${inputBg} rounded-lg p-3 border ${borderClass}`}>
              <div className={`text-xs ${textSecondary} mb-1 flex items-center gap-1`}>
                <Video size={12} /> Vidéos
              </div>
              <div className="text-2xl font-bold">{stats.videos}</div>
            </div>
            <div className={`${inputBg} rounded-lg p-3 border ${borderClass}`}>
              <div className={`text-xs ${textSecondary} mb-1 flex items-center gap-1`}>
                <Star size={12} /> Favoris
              </div>
              <div className="text-2xl font-bold">{stats.favorites}</div>
            </div>
            <div className={`${inputBg} rounded-lg p-3 border ${borderClass}`}>
              <div className={`text-xs ${textSecondary} mb-1`}>Inutilisés</div>
              <div className="text-2xl font-bold">{stats.unused}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFilters({ ...filters, search: e.target.value });
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <select
              value={filters.mediaType || 'all'}
              onChange={(e) => setFilters({ ...filters, mediaType: e.target.value })}
              className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
            </select>

            <select
              value={filters.shootingId || 'all'}
              onChange={(e) => setFilters({ ...filters, shootingId: e.target.value === 'all' ? null : e.target.value })}
              className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Tous les shootings</option>
              {shootings.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.mediaCount})</option>
              ))}
            </select>

            <select
              value={filters.isFavorite || 'all'}
              onChange={(e) => setFilters({ ...filters, isFavorite: e.target.value === 'all' ? null : e.target.value })}
              className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Tous</option>
              <option value="true">Favoris</option>
            </select>

            <select
              value={filters.isUsed || 'all'}
              onChange={(e) => setFilters({ ...filters, isUsed: e.target.value === 'all' ? null : e.target.value })}
              className={`px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Tous</option>
              <option value="true">Utilisés</option>
              <option value="false">Non utilisés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 ${textSecondary}`}>Chargement...</p>
          </div>
        ) : media.length === 0 ? (
          <div className={`text-center py-12 ${textSecondary}`}>
            <Upload size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun média trouvé</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Uploader des médias
            </button>
          </div>
        ) : (
          <MediaGrid
            media={media}
            darkMode={darkMode}
            viewMode={viewMode}
            onMediaClick={handleMediaClick}
            onDelete={deleteMedia}
            onUpdate={updateMedia}
          />
        )}
      </div>

      {/* Modals */}
      {showUpload && (
        <MediaUploadZone
          darkMode={darkMode}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
          shootings={shootings}
        />
      )}

      {selectedMedia && !onSelectMedia && (
        <MediaDetailModal
          media={selectedMedia}
          darkMode={darkMode}
          shootings={shootings}
          onClose={() => setSelectedMedia(null)}
          onUpdate={updateMedia}
          onDelete={deleteMedia}
        />
      )}
    </div>
  );
}