// src/components/PostCard.jsx
import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { MediaCarousel } from './MediaCarousel';
import { getStatusColor, formatDate, formatDateTime } from '../utils/helpers';

export const PostCard = ({ 
  post, 
  darkMode, 
  onEdit, 
  onDelete, 
  onPreview,
  onDragStart 
}) => {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const mediaItems = post.images && post.images.length > 0
    ? post.images
    : (post.imageData || post.imageUrl)
      ? [{ imageData: post.imageData, imageUrl: post.imageUrl, mediaType: 'image' }]
      : null;

  const lastVersion = post.versions?.[post.versions.length - 1];

  return (
    <div 
      className={`${cardBg} rounded-lg border ${borderClass} overflow-hidden hover:shadow-lg transition-shadow cursor-move`}
      draggable
      onDragStart={() => onDragStart(post)}
    >
      {mediaItems && mediaItems.length > 0 && (
        <MediaCarousel 
          images={mediaItems}
          alt={post.title}
        />
      )}

<div className="p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-lg">{post.title}</h3>
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
        post.status
      )}`}
    >
      {post.status}
    </span>
  </div>

        <div className="space-y-2 mb-4">
          <p className={`text-sm ${textSecondary}`}>
            <span className="font-medium">Plateform:</span> {post.platform}
          </p>
          {post.publishDate && (
            <p className={`text-sm ${textSecondary}`}>
              <span className="font-medium">Scheduled Date:</span> {formatDate(post.publishDate)}
            </p>
          )}
          {post.caption && (
            <p className={`text-sm ${textSecondary} line-clamp-2`}>
              {post.caption}
            </p>
          )}
          {lastVersion && (
            <div className={`mt-3 pt-3 border-t ${borderClass}`}>
              <p className={`text-xs ${textSecondary} font-medium mb-1`}>
               Last Updated: ({formatDateTime(lastVersion.date)})
              </p>

            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onPreview(post)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
          >
            <Eye /> Preview
          </button>
          <button
            onClick={() => onEdit(post)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id);
            }}
            className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};