import React from 'react';

export default function MediaDetailModal({ media, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-11/12 max-w-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 font-bold">×</button>

        {media.file_url.endsWith('.mp4') ? (
          <video src={media.file_url} controls className="w-full h-64 object-cover rounded" />
        ) : (
          <img src={media.file_url} alt="" className="w-full h-64 object-cover rounded" />
        )}

        <div className="mt-2">
          <p><strong>Shooting:</strong> {media.shooting || '—'}</p>
          <p><strong>Tags:</strong> {(media.tags || []).join(', ')}</p>
          <p><strong>Statut:</strong> {media.status}</p>
          <p><strong>Favori:</strong> {media.favorite ? 'Oui' : 'Non'}</p>
        </div>
      </div>
    </div>
  );
}
