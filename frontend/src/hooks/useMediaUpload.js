// src/hooks/useMediaUpload.js
import { useState } from 'react';
import { api } from '../services/api';
import { MAX_IMAGES, VIDEO_EXTENSIONS } from '../utils/constants';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);

  // Vérifier si c'est une vidéo
  const isVideo = (url) => {
    if (!url) return false;
    return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().includes(ext));
  };

  // Déterminer le type de média
  const getMediaType = (file) => {
    if (file.type && file.type.startsWith('video/')) {
      return 'video';
    }
    if (file.name && isVideo(file.name)) {
      return 'video';
    }
    return 'image';
  };

  // Upload multiple avec gestion serveur + fallback Base64
  const uploadMultiple = async (files) => {
    if (!files || files.length === 0) return [];
    
    if (files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} fichiers autorisés`);
      return [];
    }

    setUploading(true);

    try {
      // Tentative d'upload vers le serveur
      const data = await api.uploadMultipleImages(files);
      
      // Traiter les résultats
      const uploadedMedia = data.images.map(img => {
        const mediaType = isVideo(img.imageUrl) ? 'video' : 'image';
        return {
          imageUrl: img.imageUrl,
          imageData: '',
          mediaType
        };
      });

      return uploadedMedia;
    } catch (error) {
      console.error('Erreur upload serveur, utilisation de Base64:', error);
      
      // Fallback vers Base64
      const base64Promises = Array.from(files).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              imageUrl: '',
              imageData: event.target.result,
              mediaType: getMediaType(file)
            });
          };
          reader.onerror = () => {
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(base64Promises);
      return results.filter(r => r !== null);
    } finally {
      setUploading(false);
    }
  };

  // Upload single
  const uploadSingle = async (file) => {
    const results = await uploadMultiple([file]);
    return results[0] || null;
  };

  return {
    uploading,
    uploadMultiple,
    uploadSingle,
    isVideo,
    getMediaType
  };
};