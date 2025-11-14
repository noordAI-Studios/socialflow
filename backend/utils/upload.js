const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_PATH = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_PATH)) fs.mkdirSync(UPLOADS_PATH, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_PATH),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpe?g|png|webp|gif|mp4|mov)$/i;
    cb(allowed.test(file.originalname) ? null : new Error('Fichier non autorisé'), allowed.test(file.originalname));
  }
});

module.exports = { upload, UPLOADS_PATH };
