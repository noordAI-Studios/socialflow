// src/components/PreviewModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MediaCarousel } from './MediaCarousel';
import { ASPECT_RATIOS } from '../utils/constants';
import { getAspectRatioClass, formatDate } from '../utils/helpers';

export const PreviewModal = ({ post, darkMode, onClose }) => {
  const [ratio, setRatio] = useState('1:1');

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const mediaItems = post.images && post.images.length > 0
    ? post.images
    : null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Sélecteur de ratio */}
        <div className="mb-3 flex justify-center gap-2">
          {ASPECT_RATIOS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRatio(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                ratio === value 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Header Instagram style */}
        <div className={`${cardBg} rounded-t-xl p-3 flex items-center gap-3`}>
          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-0.5">
            <div className={`w-full h-full ${cardBg} rounded-full`}></div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">votre_compte</div>
            <div className={`text-xs ${textSecondary}`}>
              {post.platform}
            </div>
          </div>
          <button className="text-2xl">⋯</button>
        </div>

        {/* Media Content avec ratio dynamique */}
        <div className={`${cardBg} ${getAspectRatioClass(ratio)} relative overflow-hidden`}>
          {mediaItems && mediaItems.length > 0 ? (
            <MediaCarousel 
              images={mediaItems}
              alt={post.title}
              fullHeight={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <span className={textSecondary}>Pas de média</span>
            </div>
          )}
        </div>

        {/* Interactions */}
        <div className={`${cardBg} p-3`}>
          <div className="flex items-center gap-4 mb-2">
            <button className="text-2xl">❤️</button>
            <button className="text-2xl">💬</button>
            <button className="text-2xl">📤</button>
            <button className="text-2xl ml-auto">🔖</button>
          </div>
          
          <div className="text-sm font-semibold mb-1">1,234 likes</div>
          
          {post.caption && (
            <div className="text-sm">
              <span className="font-semibold">votre_compte</span>{' '}
              <span>{post.caption}</span>
            </div>
          )}
          
          <div className={`text-xs ${textSecondary} mt-2`}>
            {post.publishDate ? 
              formatDate(post.publishDate, { day: 'numeric', month: 'long' })
              : 'Maintenant'
            }
          </div>
        </div>

        {/* Footer */}
        <div className={`${cardBg} rounded-b-xl p-3 border-t ${borderClass}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full"></div>
            <input 
              type="text" 
              placeholder="Ajouter un commentaire..." 
              className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${textSecondary}`}
              readOnly
            />
          </div>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};