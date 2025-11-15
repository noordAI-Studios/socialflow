import React, { useState } from 'react';
import { X, Star, Trash2, Download, Copy, Tag, Folder } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/helpers';

export default function MediaDetailModal({ 
  media, 
  darkMode, 
  shootings = [],
  onClose, 
  onUpdate,
  onDelete 
}) {
  const [setEditing] = useState(false);
  const [formData, setFormData] = useState({
    shootingId: media.shootingId || '',
    tags: media.tags || [],
    isFavorite: media.isFavorite || false,
    notes: media.notes || ''
  });
  const [newTag, setNewTag] = useState('');

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  const isVideo = media.mediaType === 'video';

  const handleSave = async () => {
    try {
      await onUpdate(media.id, formData);
      setEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer définitivement ce média ?')) return;
    
    try {
      await onDelete(media.id);
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags.includes(newTag.trim())) return;
    
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(media.fileUrl);
    alert('URL copiée!');
  };

  const downloadMedia = () => {
    const link = document.createElement('a');
    link.href = media.fileUrl;
    link.download = media.originalName;
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`${cardBg} rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Media Preview */}
        <div className="md:w-2/3 bg-black flex items-center justify-center p-4">
          {isVideo ? (
            <video
              src={media.fileUrl}
              controls
              autoPlay
              loop
              className="max-w-full max-h-[80vh] rounded"
            />
          ) : (
            <img
              src={media.fileUrl}
              alt={media.originalName}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          )}
        </div>

        {/* Right: Details & Actions */}
        <div className={`md:w-1/3 ${cardBg} flex flex-col overflow-hidden`}>
          {/* Header */}
          <div className={`p-4 border-b ${borderClass} flex items-center justify-between`}>
            <h2 className="font-semibold truncate">{media.originalName}</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${inputBg} hover:opacity-80`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, isFavorite: !formData.isFavorite })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${borderClass} ${
                  formData.isFavorite ? 'bg-yellow-500 text-white' : inputBg
                }`}
              >
                <Star size={16} fill={formData.isFavorite ? 'currentColor' : 'none'} />
                {formData.isFavorite ? 'Favori' : 'Ajouter aux favoris'}
              </button>
              
              <button
                onClick={copyUrl}
                className={`p-2 rounded-lg border ${borderClass} ${inputBg} hover:opacity-80`}
                title="Copier URL"
              >
                <Copy size={20} />
              </button>
              
              <button
                onClick={downloadMedia}
                className={`p-2 rounded-lg border ${borderClass} ${inputBg} hover:opacity-80`}
                title="Télécharger"
              >
                <Download size={20} />
              </button>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>Type</label>
                <div className="text-sm">{isVideo ? '🎥 Vidéo' : '🖼️ Image'}</div>
              </div>

              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>Taille</label>
                <div className="text-sm">{(media.fileSize / 1024 / 1024).toFixed(2)} MB</div>
              </div>

              {media.width && media.height && (
                <div>
                  <label className={`text-xs ${textSecondary} mb-1 block`}>Dimensions</label>
                  <div className="text-sm">{media.width} × {media.height} px</div>
                </div>
              )}

              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>Uploadé le</label>
                <div className="text-sm">{formatDateTime(media.uploadedAt)}</div>
              </div>

              {media.usageCount > 0 && (
                <div>
                  <label className={`text-xs ${textSecondary} mb-1 block`}>Utilisation</label>
                  <div className="text-sm">
                    ✓ Utilisé {media.usageCount} fois
                    {media.lastUsedAt && ` (dernière: ${formatDate(media.lastUsedAt)})`}
                  </div>
                </div>
              )}
            </div>

            {/* Shooting */}
            <div>
              <label className={`text-xs ${textSecondary} mb-2 flex items-center gap-1`}>
                <Folder size={14} /> Shooting
              </label>
              <select
                value={formData.shootingId}
                onChange={(e) => setFormData({ ...formData, shootingId: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Sans shooting</option>
                {shootings.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className={`text-xs ${textSecondary} mb-2 flex items-center gap-1`}>
                <Tag size={14} /> Tags
              </label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Ajouter un tag..."
                  className={`flex-1 px-3 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={`text-xs ${textSecondary} mb-2 block`}>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Ajoutez des notes..."
                className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${borderClass} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${borderClass} space-y-2`}>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                💾 Enregistrer
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2 ${inputBg} hover:opacity-80 rounded-lg`}
              >
                Fermer
              </button>
            </div>
            
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}