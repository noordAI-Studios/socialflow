import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { ACCEPTED_MEDIA_TYPES, MAX_VIDEO_SIZE } from '../../utils/constants';

export default function MediaUploadZone({ 
  darkMode, 
  onClose, 
  onUpload,
  shootings = [] 
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedShooting, setSelectedShooting] = useState('');
  const [newShootingName, setNewShootingName] = useState('');
  const fileInputRef = useRef();

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList) => {
    const validFiles = fileList.filter(file => {
      const isValid = file.type.match(/image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|quicktime|x-msvideo)/);
      const sizeOk = file.size <= MAX_VIDEO_SIZE;
      
      if (!isValid) {
        alert(`${file.name}: Format non supporté`);
        return false;
      }
      if (!sizeOk) {
        alert(`${file.name}: Fichier trop volumineux (max 50MB)`);
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }))]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (fileItem, index) => {
        try {
          await onUpload([fileItem.file], {
            shootingId: selectedShooting || null
          });
          
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, status: 'success' } : f
          ));
        } catch (error) {
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, status: 'error', error: error.message } : f
          ));
        }
      });

      await Promise.all(uploadPromises);
      
      // Close after successful uploads
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`${cardBg} rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b ${borderClass} flex items-center justify-between`}>
          <h2 className="text-xl font-semibold">📤 Upload de médias</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${inputBg} hover:opacity-80`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Shooting Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Shooting (optionnel)
            </label>
            <select
              value={selectedShooting}
              onChange={(e) => setSelectedShooting(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Sans shooting</option>
              {shootings.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              <option value="new">➕ Créer un nouveau shooting</option>
            </select>
          </div>

          {selectedShooting === 'new' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nom du nouveau shooting"
                value={newShootingName}
                onChange={(e) => setNewShootingName(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : `${borderClass} ${inputBg}`
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_MEDIA_TYPES}
              onChange={handleFileInput}
              className="hidden"
            />
            
            <Upload size={48} className={`mx-auto mb-4 ${textSecondary}`} />
            
            <p className="text-lg mb-2">
              Glissez vos fichiers ici
            </p>
            <p className={`text-sm ${textSecondary} mb-4`}>
              ou
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Parcourir les fichiers
            </button>
            
            <p className={`text-xs ${textSecondary} mt-4`}>
              Formats: JPG, PNG, GIF, WebP, MP4, MOV (max 50MB par vidéo)
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium mb-3">
                Fichiers à uploader ({files.length})
              </h3>
              
              {files.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${borderClass} ${inputBg}`}
                >
                  <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden shrink-0">
                    {item.file.type.startsWith('video') ? (
                      <video src={item.preview} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.file.name}</p>
                    <p className={`text-xs ${textSecondary}`}>
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {item.status === 'success' && (
                    <CheckCircle size={20} className="text-green-500" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle size={20} className="text-red-500" />
                  )}
                  {item.status === 'pending' && !uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <X size={20} className="text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${borderClass} flex justify-between items-center`}>
          <p className={`text-sm ${textSecondary}`}>
            {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className={`px-6 py-2 ${inputBg} hover:opacity-80 rounded-lg transition-opacity`}
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                (files.length === 0 || uploading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Upload en cours...' : 'Uploader'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}