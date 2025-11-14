import React, { useState } from 'react';
import { useMedia } from '../hooks/useMedia';
import MediaDetailModal from './MediaDetailModal';

export default function MediaGrid() {
  const { media, loading, setSort } = useMedia();
  const [selected, setSelected] = useState(null);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <div>
          <select onChange={e => setSort(e.target.value)} className="border p-1 rounded">
            <option value="uploaded_at">Date</option>
            <option value="file_url">Nom</option>
            <option value="status">Statut</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map(m => (
          <div key={m.id} className="cursor-pointer" onClick={() => setSelected(m)}>
            {m.file_url.endsWith('.mp4') ? (
              <video src={m.file_url} className="w-full h-40 object-cover rounded" />
            ) : (
              <img src={m.thumbnail_url || m.file_url} alt="" className="w-full h-40 object-cover rounded" />
            )}
            <div className="text-xs mt-1">{m.shooting || '—'}</div>
          </div>
        ))}
      </div>

      {selected && <MediaDetailModal media={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
