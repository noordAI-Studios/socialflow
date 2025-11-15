const db = require('../db');

// GET all media with filters
function getMedia({ 
  search, 
  mediaType, 
  shootingId, 
  isFavorite, 
  isUsed, 
  tags,
  sortBy = 'uploadedAt',
  sortOrder = 'DESC',
  limit = 100,
  offset = 0 
}, callback) {
  let query = `
    SELECT 
      m.*,
      mm.shootingId,
      mm.tags,
      mm.isFavorite,
      mm.usageCount,
      mm.lastUsedAt,
      mm.notes,
      s.name as shootingName
    FROM media m
    LEFT JOIN media_metadata mm ON m.id = mm.mediaId
    LEFT JOIN shootings s ON mm.shootingId = s.id
    WHERE 1=1
  `;
  
  const params = [];

  // Filtres
  if (search) {
    query += ' AND (m.originalName LIKE ? OR m.filename LIKE ? OR mm.tags LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (mediaType && mediaType !== 'all') {
    query += ' AND m.mediaType = ?';
    params.push(mediaType);
  }
  
  if (shootingId) {
    query += ' AND mm.shootingId = ?';
    params.push(shootingId);
  }
  
  if (isFavorite === 'true' || isFavorite === true) {
    query += ' AND mm.isFavorite = 1';
  }
  
  if (isUsed === 'true') {
    query += ' AND mm.usageCount > 0';
  } else if (isUsed === 'false') {
    query += ' AND (mm.usageCount = 0 OR mm.usageCount IS NULL)';
  }

  if (tags) {
    const tagList = Array.isArray(tags) ? tags : tags.split(',');
    tagList.forEach(tag => {
      query += ' AND mm.tags LIKE ?';
      params.push(`%"${tag.trim()}"%`);
    });
  }

  // Tri
  const validSorts = ['uploadedAt', 'filename', 'fileSize', 'usageCount'];
  const validOrders = ['ASC', 'DESC'];
  
  const sort = validSorts.includes(sortBy) ? sortBy : 'uploadedAt';
  const order = validOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  
  query += ` ORDER BY m.${sort} ${order}`;
  
  // Pagination
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, callback);
}

// GET single media
function getMediaById(id, callback) {
  const query = `
    SELECT 
      m.*,
      mm.shootingId,
      mm.tags,
      mm.isFavorite,
      mm.usageCount,
      mm.lastUsedAt,
      mm.notes,
      s.name as shootingName
    FROM media m
    LEFT JOIN media_metadata mm ON m.id = mm.mediaId
    LEFT JOIN shootings s ON mm.shootingId = s.id
    WHERE m.id = ?
  `;
  
  db.get(query, [id], callback);
}

// CREATE media
function createMedia(data, callback) {
  const { 
    id, filename, originalName, fileUrl, thumbnailUrl,
    fileSize, mimeType, mediaType, width, height, duration, userId 
  } = data;
  
  const uploadedAt = new Date().toISOString();
  
  db.serialize(() => {
    // Insérer media
    db.run(
      `INSERT INTO media (
        id, filename, originalName, fileUrl, thumbnailUrl,
        fileSize, mimeType, mediaType, width, height, duration, uploadedAt, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, filename, originalName, fileUrl, thumbnailUrl, 
       fileSize, mimeType, mediaType, width, height, duration, uploadedAt, userId],
      (err) => {
        if (err) return callback(err);
        
        // Créer métadonnées par défaut
        db.run(
          'INSERT INTO media_metadata (mediaId) VALUES (?)',
          [id],
          (metaErr) => {
            if (metaErr) return callback(metaErr);
            getMediaById(id, callback);
          }
        );
      }
    );
  });
}

// UPDATE media metadata
function updateMediaMetadata(id, data, callback) {
  const { shootingId, tags, isFavorite, notes } = data;
  
  const updates = [];
  const params = [];
  
  if (shootingId !== undefined) {
    updates.push('shootingId = ?');
    params.push(shootingId);
  }
  
  if (tags !== undefined) {
    updates.push('tags = ?');
    params.push(typeof tags === 'string' ? tags : JSON.stringify(tags));
  }
  
  if (isFavorite !== undefined) {
    updates.push('isFavorite = ?');
    params.push(isFavorite ? 1 : 0);
  }
  
  if (notes !== undefined) {
    updates.push('notes = ?');
    params.push(notes);
  }
  
  if (updates.length === 0) {
    return callback(new Error('No fields to update'));
  }
  
  params.push(id);
  
  db.run(
    `UPDATE media_metadata SET ${updates.join(', ')} WHERE mediaId = ?`,
    params,
    function(err) {
      if (err) return callback(err);
      getMediaById(id, callback);
    }
  );
}

// DELETE media
function deleteMedia(id, callback) {
  db.run('DELETE FROM media WHERE id = ?', [id], callback);
}

// Increment usage count
function incrementUsage(mediaId, postId, callback) {
  const now = new Date().toISOString();
  
  db.serialize(() => {
    // Lier media à post
    db.run(
      `INSERT OR IGNORE INTO media_posts (id, mediaId, postId, createdAt) 
       VALUES (?, ?, ?, ?)`,
      [`${mediaId}_${postId}`, mediaId, postId, now]
    );
    
    // Incrémenter usage
    db.run(
      `UPDATE media_metadata 
       SET usageCount = usageCount + 1, lastUsedAt = ?
       WHERE mediaId = ?`,
      [now, mediaId],
      callback
    );
  });
}

// --- SHOOTINGS ---

function getShootings(callback) {
  const query = `
    SELECT 
      s.*,
      COUNT(mm.mediaId) as mediaCount
    FROM shootings s
    LEFT JOIN media_metadata mm ON s.id = mm.shootingId
    GROUP BY s.id
    ORDER BY s.createdAt DESC
  `;
  
  db.all(query, [], callback);
}

function createShooting(data, callback) {
  const { id, name, description, userId } = data;
  const createdAt = new Date().toISOString();
  
  db.run(
    'INSERT INTO shootings (id, name, description, createdAt, userId) VALUES (?, ?, ?, ?, ?)',
    [id, name, description, createdAt, userId],
    function(err) {
      if (err) return callback(err);
      db.get('SELECT * FROM shootings WHERE id = ?', [id], callback);
    }
  );
}

function deleteShooting(id, callback) {
  db.run('DELETE FROM shootings WHERE id = ?', [id], callback);
}

module.exports = {
  getMedia,
  getMediaById,
  createMedia,
  updateMediaMetadata,
  deleteMedia,
  incrementUsage,
  getShootings,
  createShooting,
  deleteShooting
};