const express = require('express');
const cors = require('cors');
require('dotenv').config();

const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware global
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Routes API
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Middleware gestion erreurs
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});
