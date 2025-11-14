import { useState } from 'react';
import {
  loadGoogleAPI,
  initGapi,
  initPicker,
  authenticateGoogle,
  showDrivePicker,
  downloadDriveFile,
  blobToBase64
} from '../services/googleDrive';

export const useGoogleDrive = () => {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Initialiser Google Drive
  const initializeDrive = async () => {
    setLoading(true);
    try {
      // Charger les scripts Google
      await loadGoogleAPI();
      
      // Charger le script OAuth2
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = resolve;
        document.body.appendChild(script);
      });

      // Init APIs
      await initGapi();
      initPicker();

      // Authentifier
      const token = await authenticateGoogle();
      if (token) {
        setAccessToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur init Drive:', error);
      alert('Erreur lors de l\'initialisation de Google Drive');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le picker et sélectionner des fichiers
  const selectFiles = async () => {
    if (!accessToken) {
      const initialized = await initializeDrive();
      if (!initialized) return [];
    }

    return new Promise((resolve) => {
      showDrivePicker(accessToken, async (files) => {
        setLoading(true);
        try {
          const processedFiles = await Promise.all(
            files.map(async (file) => {
              const blob = await downloadDriveFile(file.id, accessToken);
              if (!blob) return null;

              const base64 = await blobToBase64(blob);
              const isVideo = file.mimeType.startsWith('video/');

              return {
                imageUrl: '',
                imageData: base64,
                mediaType: isVideo ? 'video' : 'image',
                name: file.name
              };
            })
          );

          resolve(processedFiles.filter(f => f !== null));
        } catch (error) {
          console.error('Erreur traitement fichiers:', error);
          resolve([]);
        } finally {
          setLoading(false);
        }
      });
    });
  };

  return {
    loading,
    initializeDrive,
    selectFiles,
    isAuthenticated: !!accessToken
  };
};