const express = require('express');
const cors = require('cors');
require('dotenv').config();

const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const mediaRoutes = require('./routes/media'); // ✨ NOUVEAU
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware global
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/uploads/thumbs', express.static('uploads/thumbs')); // ✨ NOUVEAU

// Routes API
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes); // ✨ NOUVEAU

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Middleware gestion erreurs
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
  console.log(`✨ Media Library API: http://localhost:${PORT}/api/media`); // ✨ NOUVEAU
});