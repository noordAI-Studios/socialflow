const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/mediaController');

// Configuration multer pour upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type. Only images and videos are allowed.'));
};

const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter
});

// Routes Media
router.get('/', controller.getMedia);
router.get('/:id', controller.getMediaById);
router.post('/upload', upload.single('file'), controller.uploadMedia);
router.patch('/:id', controller.updateMedia);
router.delete('/:id', controller.deleteMedia);

// Routes Shootings
router.get('/shootings/list', controller.getShootings);
router.post('/shootings', controller.createShooting);
router.delete('/shootings/:id', controller.deleteShooting);

module.exports = router;