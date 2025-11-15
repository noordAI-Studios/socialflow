const mediaModel = require('../models/mediaModel');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // Pour thumbnails images
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const UPLOADS_PATH = path.join(__dirname, '../uploads');
const THUMBS_PATH = path.join(__dirname, '../uploads/thumbs');

// Créer les dossiers si nécessaire
[UPLOADS_PATH, THUMBS_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// GET all media
async function getMedia(req, res) {
  mediaModel.getMedia(req.query, (err, media) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Parser les tags JSON
    const parsedMedia = media.map(m => ({
      ...m,
      tags: m.tags ? JSON.parse(m.tags) : [],
      isFavorite: Boolean(m.isFavorite)
    }));
    
    res.json(parsedMedia);
  });
}

// GET single media
async function getMediaById(req, res) {
  mediaModel.getMediaById(req.params.id, (err, media) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!media) return res.status(404).json({ error: 'Media not found' });
    
    res.json({
      ...media,
      tags: media.tags ? JSON.parse(media.tags) : [],
      isFavorite: Boolean(media.isFavorite)
    });
  });
}

// CREATE media (upload)
async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
    const id = Date.now().toString() + '-' + Math.round(Math.random() * 1e9);
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    let thumbnailUrl = null;
    let width = null;
    let height = null;

    // Générer thumbnail pour images
    if (mediaType === 'image') {
      try {
        const thumbFilename = `thumb_${file.filename}`;
        const thumbPath = path.join(THUMBS_PATH, thumbFilename);
        
        const metadata = await sharp(file.path)
          .resize(300, 300, { fit: 'cover' })
          .toFile(thumbPath);
        
        width = metadata.width;
        height = metadata.height;
        
        // Lire l'image originale pour dimensions
        const originalMetadata = await sharp(file.path).metadata();
        width = originalMetadata.width;
        height = originalMetadata.height;
        
        thumbnailUrl = `${req.protocol}://${req.get('host')}/uploads/thumbs/${thumbFilename}`;
      } catch (thumbErr) {
        console.error('Thumbnail generation failed:', thumbErr);
        // Continue sans thumbnail
      }
    }

    const mediaData = {
      id,
      filename: file.filename,
      originalName: file.originalname,
      fileUrl,
      thumbnailUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      mediaType,
      width,
      height,
      duration: null, // TODO: extraire pour vidéos
      userId: req.body.userId || null
    };

    mediaModel.createMedia(mediaData, (err, newMedia) => {
      if (err) {
        // Cleanup file on error
        try { fs.unlinkSync(file.path); } catch(e) {}
        return res.status(500).json({ error: err.message });
      }
      
      res.json(newMedia);
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
}

// UPDATE media metadata
async function updateMedia(req, res) {
  const id = req.params.id;
  
  mediaModel.updateMediaMetadata(id, req.body, (err, updatedMedia) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!updatedMedia) return res.status(404).json({ error: 'Media not found' });
    
    res.json({
      ...updatedMedia,
      tags: updatedMedia.tags ? JSON.parse(updatedMedia.tags) : [],
      isFavorite: Boolean(updatedMedia.isFavorite)
    });
  });
}

// DELETE media
async function deleteMedia(req, res) {
  const id = req.params.id;
  
  // Récupérer info média pour supprimer fichiers
  mediaModel.getMediaById(id, (err, media) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!media) return res.status(404).json({ error: 'Media not found' });
    
    // Supprimer de DB
    mediaModel.deleteMedia(id, (delErr) => {
      if (delErr) return res.status(500).json({ error: delErr.message });
      
      // Supprimer fichiers
      try {
        const filePath = path.join(UPLOADS_PATH, media.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        if (media.thumbnailUrl) {
          const thumbFilename = path.basename(media.thumbnailUrl);
          const thumbPath = path.join(THUMBS_PATH, thumbFilename);
          if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
          }
        }
      } catch (fsErr) {
        console.error('File deletion error:', fsErr);
      }
      
      res.json({ message: 'Media deleted', id });
    });
  });
}

// --- SHOOTINGS ---

async function getShootings(req, res) {
  mediaModel.getShootings((err, shootings) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(shootings);
  });
}

async function createShooting(req, res) {
  const id = Date.now().toString();
  const data = { ...req.body, id };
  
  mediaModel.createShooting(data, (err, shooting) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(shooting);
  });
}

async function deleteShooting(req, res) {
  mediaModel.deleteShooting(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Shooting deleted', id: req.params.id });
  });
}

module.exports = {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getShootings,
  createShooting,
  deleteShooting
};