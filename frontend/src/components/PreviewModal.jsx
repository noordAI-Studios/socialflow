// src/components/PreviewModal.jsx
import React, { useState } from 'react';
import { X, Heart,Share, MessageCircle, Star} from 'lucide-react';
import { MediaCarousel } from './MediaCarousel';
import { ASPECT_RATIOS } from '../utils/constants';
import { getAspectRatioClass, formatDate } from '../utils/helpers';

export const PreviewModal = ({ post, darkMode, onClose }) => {
  const [ratio, setRatio] = useState('1:1');
  const [previewPlatform, setPreviewPlatform] = useState('instagram'); // 'instagram' ou 'fanvue'

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const mediaItems = post.images && post.images.length > 0
    ? post.images
    : null;

  // Layout Instagram
  const InstagramLayout = () => (
    <>
      {/* Header */}
      <div className={`${cardBg} rounded-t-xl p-3 flex items-center gap-3`}>
        <div className="w-8 h-8 bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-0.5">
          <div className={`w-full h-full ${cardBg} rounded-full`}></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">itsvictoriababy</div>
          <div className={`text-xs ${textSecondary}`}>Audio d'origine
          </div>
        </div>
        <button className="text-2xl">⋯</button>
      </div>

      {/* Media Content */}
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
          <button className="text-2xl"><Heart /></button>
          <button className="text-2xl"><MessageCircle /></button>
          <button className="text-2xl"><Share /></button>
          <button className="text-2xl ml-auto"><Star /></button>
        </div>
        
        <div className="text-sm font-semibold mb-1">10,897 likes</div>
        
        {post.caption && (
          <div className="text-sm">
            <span className="font-semibold">itsvictoriababy</span>{' '}
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
          <div className="w-8 h-8 bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full"></div>
          <input 
            type="text" 
            placeholder="Ajouter un commentaire..." 
            className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${textSecondary}`}
            readOnly
          />
        </div>
      </div>
    </>
  );

  // Layout Fanvue
  const FanvueLayout = () => (
    <>
      {/* Header */}
      <div className={`${cardBg} rounded-t-xl p-3 flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-linear-to-tr from-pink-500 to-purple-600">
          <div className={`w-full h-full ${cardBg} m-0.5 rounded-full`}></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Victoria Matosa</div>
          <div className={`text-xs ${textSecondary}`}>
           @itsvictoriababy
          </div>
        </div>
<div className={`text-xs ${textSecondary}`}>
  {post.publishDate ? (() => {
    const diffDays = Math.floor(
      (new Date() - new Date(post.publishDate)) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0
      ? `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
      : `dans ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
  })()
  : 'il y a 11 mois'}
</div>
        <button className="text-xl">⋯</button>
      </div>

      {/* Caption AVANT l'image (spécifique Fanvue) */}
      {post.caption && (
        <div className={`${cardBg} px-4 py-3`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.caption}</p>
        </div>
      )}

      {/* Media Content */}
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

      {/* Interactions en bas (Fanvue style) */}
      <div className={`${cardBg} rounded-b-xl p-3`}>
        <div className="flex items-center gap-4 mb-2">
          <button className="flex items-center gap-1">
            <span className="text-xl"><Heart /></span>
          </button>
          <button className="flex items-center gap-1">
            <span className="text-xl"><MessageCircle /></span>
          </button>
        </div>
        
        <div className="text-sm font-semibold">879 likes</div>
        <div className="text-sm font-semibold"></div>
      </div>
    </>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Sélecteur de plateforme preview */}
        <div className="mb-3 flex justify-center gap-2">
          <button
            onClick={() => setPreviewPlatform('instagram')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewPlatform === 'instagram' 
                ? 'bg-pink-600 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            📷 Instagram
          </button>
          <button
            onClick={() => setPreviewPlatform('fanvue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewPlatform === 'fanvue' 
                ? 'bg-pink-600 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            💎 Fanvue
          </button>
        </div>

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

        {/* Afficher le layout selon la plateforme */}
        {previewPlatform === 'instagram' ? <InstagramLayout /> : <FanvueLayout />}

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