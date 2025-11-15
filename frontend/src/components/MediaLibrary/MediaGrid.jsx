import React, { useState } from 'react';
import { Star, Trash2, Eye, CheckSquare, Square } from 'lucide-react';
import { isVideo } from '../../utils/helpers';

export default function MediaGrid({ 
  media, 
  darkMode, 
  viewMode = 'grid',
  onMediaClick,
  onDelete,
  onUpdate 
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleFavorite = async (e, media) => {
    e.stopPropagation();
    await onUpdate(media.id, { isFavorite: !media.isFavorite });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer ce média ?')) return;
    await onDelete(id);
  };

  const MediaCard = ({ item }) => {
    const isVideoFile = item.mediaType === 'video' || isVideo(item.fileUrl);
    const mediaUrl = item.thumbnailUrl || item.fileUrl;
    const isSelected = selectedIds.has(item.id);

    return (
      <div
        onClick={() => {
          if (selectionMode) {
            toggleSelection(item.id);
          } else {
            onMediaClick(item);
          }
        }}
        className={`${cardBg} rounded-lg border ${borderClass} overflow-hidden cursor-pointer hover:shadow-lg transition-all group relative ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {/* Media Preview */}
        <div className="aspect-square bg-gray-700 overflow-hidden relative">
          {isVideoFile ? (
            <>
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-16 border-l-gray-900 border-t-10 border-t-transparent border-b-10 border-b-transparent ml-1"></div>
                </div>
              </div>
            </>
          ) : (
            <img
              src={mediaUrl}
              alt={item.originalName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'; }}
            />
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMediaClick(item);
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full mx-1"
            >
              <Eye size={20} className="text-gray-900" />
            </button>
            <button
              onClick={(e) => handleDelete(e, item.id)}
              className="p-2 bg-red-600/90 hover:bg-red-700 rounded-full mx-1 text-white"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Selection Checkbox */}
          {selectionMode && (
            <div className="absolute top-2 left-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(item.id);
                }}
                className="p-1 bg-white rounded"
              >
                {isSelected ? (
                  <CheckSquare size={20} className="text-blue-600" />
                ) : (
                  <Square size={20} className="text-gray-400" />
                )}
              </button>
            </div>
          )}

          {/* Indicators */}
          <div className="absolute top-2 right-2 flex gap-1">
            {item.isFavorite && (
              <div className="p-1 bg-yellow-500 rounded-full">
                <Star size={14} fill="white" className="text-white" />
              </div>
            )}
            {item.usageCount > 0 && (
              <div className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium">
                ✓ {item.usageCount}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.originalName}</p>
              <p className={`text-xs ${textSecondary} truncate`}>
                {item.shootingName || 'Sans shooting'}
              </p>
            </div>
            <button
              onClick={(e) => toggleFavorite(e, item)}
              className={`p-1 rounded transition-colors ${
                item.isFavorite 
                  ? 'text-yellow-500' 
                  : `${textSecondary} hover:text-yellow-500`
              }`}
            >
              <Star size={16} fill={item.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className={`mt-2 text-xs ${textSecondary} flex items-center gap-2`}>
            <span>{(item.fileSize / 1024 / 1024).toFixed(2)} MB</span>
            {item.width && item.height && (
              <span>• {item.width}×{item.height}</span>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map(tag => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className={`text-xs px-2 py-0.5 ${textSecondary}`}>
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (viewMode === 'grid') {
    return (
      <>
        {media.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setSelectionMode(!selectionMode)}
              className={`px-4 py-2 rounded-lg ${
                selectionMode ? 'bg-blue-600 text-white' : `${cardBg} border ${borderClass}`
              }`}
            >
              {selectionMode ? 'Annuler sélection' : 'Sélectionner'}
            </button>
            {selectionMode && selectedIds.size > 0 && (
              <span className={textSecondary}>
                {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {media.map(item => (
        <div
          key={item.id}
          onClick={() => onMediaClick(item)}
          className={`${cardBg} border ${borderClass} rounded-lg p-4 flex items-center gap-4 hover:shadow-md cursor-pointer transition-shadow`}
        >
          <div className="w-20 h-20 bg-gray-700 rounded overflow-hidden shrink-0">
            {item.mediaType === 'video' ? (
              <video src={item.thumbnailUrl || item.fileUrl} className="w-full h-full object-cover" muted />
            ) : (
              <img src={item.thumbnailUrl || item.fileUrl} alt={item.originalName} className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{item.originalName}</p>
              {item.isFavorite && <Star size={14} fill="currentColor" className="text-yellow-500" />}
            </div>
            <p className={`text-sm ${textSecondary}`}>{item.shootingName || 'Sans shooting'}</p>
            <div className={`text-xs ${textSecondary} mt-1`}>
              {(item.fileSize / 1024 / 1024).toFixed(2)} MB
              {item.width && ` • ${item.width}×${item.height}`}
              {item.usageCount > 0 && ` • Utilisé ${item.usageCount} fois`}
            </div>
          </div>

          <button
            onClick={(e) => handleDelete(e, item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}