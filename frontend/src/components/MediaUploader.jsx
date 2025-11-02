// src/components/MediaUploader.jsx
import React from 'react';
import { Upload, X } from 'lucide-react';
import { useMediaUpload } from '../hooks/useMediaUpload';
import { ACCEPTED_MEDIA_TYPES } from '../utils/constants';

export const MediaUploader = ({ images, onImagesChange, darkMode }) => {
  const { uploading, uploadMultiple, isVideo: checkIsVideo } = useMediaUpload();

  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedMedia = await uploadMultiple(Array.from(files));
    if (uploadedMedia.length > 0) {
      onImagesChange([...images, ...uploadedMedia]);
    }

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const isVideoMedia = (img) => {
    if (img.mediaType === 'video') return true;
    if (img.imageUrl && checkIsVideo(img.imageUrl)) return true;
    if (img.imageData && img.imageData.startsWith('data:video')) return true;
    return false;
  };

  return (
    <div className="space-y-3">
      <div className={`border-2 border-dashed ${borderClass} rounded-lg p-6 text-center`}>
        <input
          type="file"
          accept={ACCEPTED_MEDIA_TYPES}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
          disabled={uploading}
        />
        <label 
          htmlFor="media-upload" 
          className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50' : ''}`}
        >
          <Upload size={32} className={textSecondary} />
          <span className={`text-sm ${textSecondary}`}>
            {uploading ? 'Upload en cours...' : 'Cliquez pour uploader des images/vidéos (max 50MB par vidéo)'}
          </span>
          <span className={`text-xs ${textSecondary}`}>
            Formats: JPG, PNG, GIF, MP4, MOV
          </span>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, index) => {
            const isVideoFile = isVideoMedia(img);
            const mediaSrc = img.imageData || img.imageUrl;
            
            return (
              <div key={index} className="relative">
                {isVideoFile ? (
                  <video 
                    src={mediaSrc} 
                    className="w-full h-24 object-cover rounded-lg"
                    muted
                  />
                ) : (
                  <img 
                    src={mediaSrc} 
                    alt={`Media ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  <X size={14} />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                    Principale
                  </div>
                )}
                {isVideoFile && (
                  <div className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                    🎥
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};