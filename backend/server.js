// server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif||mp4|mov|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images et videos mp4 et mov sont autorisées!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Initialisation de la base de données
const db = new sqlite3.Database('./social_media.db', (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données SQLite');
    initDatabase();
  }
});

// Création des tables
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      caption TEXT,
      imageUrl TEXT,
      imageData TEXT,
      aiPrompt TEXT,
      status TEXT NOT NULL,
      publishDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      userId TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table posts:', err);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId TEXT NOT NULL,
      imageUrl TEXT,
      imageData TEXT,
      isPrimary INTEGER DEFAULT 0,
      position INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table images:', err);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId TEXT NOT NULL,
      date TEXT NOT NULL,
      title TEXT,
      caption TEXT,
      status TEXT,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table versions:', err);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table users:', err);
    }
  });
}

// Routes API

// GET - Récupérer tous les posts
app.get('/api/posts', (req, res) => {
  const { status, platform, search, startDate, endDate } = req.query;
  let query = 'SELECT * FROM posts WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (platform && platform !== 'all') {
    query += ' AND platform = ?';
    params.push(platform);
  }

  if (search) {
    query += ' AND (title LIKE ? OR caption LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (startDate && endDate) {
    query += ' AND publishDate BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  query += ' ORDER BY publishDate DESC, createdAt DESC';

  db.all(query, params, async (err, posts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Récupérer les versions et images pour chaque post
    const postsWithData = await Promise.all(
      posts.map(post => {
        return new Promise((resolve) => {
          db.all(
            'SELECT * FROM versions WHERE postId = ? ORDER BY date ASC',
            [post.id],
            (err, versions) => {
              db.all(
                'SELECT * FROM images WHERE postId = ? ORDER BY position ASC',
                [post.id],
                (err2, images) => {
                  resolve({ 
                    ...post, 
                    versions: versions || [],
                    images: images || []
                  });
                }
              );
            }
          );
        });
      })
    );

    res.json(postsWithData);
  });
});

// GET - Récupérer un post par ID
app.get('/api/posts/:id', (req, res) => {
  db.get('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, post) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    db.all(
      'SELECT * FROM versions WHERE postId = ? ORDER BY date ASC',
      [post.id],
      (err, versions) => {
        db.all(
          'SELECT * FROM images WHERE postId = ? ORDER BY position ASC',
          [post.id],
          (err2, images) => {
            res.json({ ...post, versions: versions || [], images: images || [] });
          }
        );
      }
    );
  });
});

// POST - Créer un nouveau post
app.post('/api/posts', (req, res) => {
  const {
    id,
    title,
    platform,
    caption,
    imageUrl,
    imageData,
    images: postImages,
    aiPrompt,
    status,
    publishDate,
    userId
  } = req.body;

  if (!title || !platform || !status) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const postId = id || Date.now().toString();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO posts (id, title, platform, caption, imageUrl, imageData, aiPrompt, status, publishDate, createdAt, updatedAt, userId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [postId, title, platform, caption || '', imageUrl || '', imageData || '', aiPrompt || '', status, publishDate || '', now, now, userId || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Insérer les images multiples si présentes
      if (postImages && postImages.length > 0) {
        const imageInserts = postImages.map((img, index) => {
          return new Promise((resolve) => {
            db.run(
              'INSERT INTO images (postId, imageUrl, imageData, isPrimary, position, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
              [postId, img.imageUrl || '', img.imageData || '', index === 0 ? 1 : 0, index, now],
              () => resolve()
            );
          });
        });

        Promise.all(imageInserts).then(() => {
          createVersionAndRespond(postId, title, caption, status, now, res);
        });
      } else {
        createVersionAndRespond(postId, title, caption, status, now, res);
      }
    }
  );
});

function createVersionAndRespond(postId, title, caption, status, now, res) {
  db.run(
    'INSERT INTO versions (postId, date, title, caption, status) VALUES (?, ?, ?, ?, ?)',
    [postId, now, title, caption || '', status],
    (err) => {
      if (err) {
        console.error('Erreur lors de la création de la version:', err);
      }
      
      // Récupérer le post complet avec images
      db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        db.all('SELECT * FROM images WHERE postId = ? ORDER BY position ASC', [postId], (err, images) => {
          res.status(201).json({
            ...post,
            images: images || [],
            versions: [{
              postId,
              date: now,
              title,
              caption,
              status
            }]
          });
        });
      });
    }
  );
}

// PUT - Mettre à jour un post
app.put('/api/posts/:id', (req, res) => {
  const {
    title,
    platform,
    caption,
    imageUrl,
    imageData,
    images: postImages,
    aiPrompt,
    status,
    publishDate
  } = req.body;

  const now = new Date().toISOString();

  db.run(
    `UPDATE posts 
     SET title = ?, platform = ?, caption = ?, imageUrl = ?, imageData = ?, aiPrompt = ?, status = ?, publishDate = ?, updatedAt = ?
     WHERE id = ?`,
    [title, platform, caption || '', imageUrl || '', imageData || '', aiPrompt || '', status, publishDate || '', now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Post non trouvé' });
      }

      // TOUJOURS supprimer les anciennes images et réinsérer les nouvelles
      db.run('DELETE FROM images WHERE postId = ?', [req.params.id], (deleteErr) => {
        if (deleteErr) {
          console.error('Erreur lors de la suppression des images:', deleteErr);
        }

        // Insérer les nouvelles images (même si le tableau est vide)
        if (postImages && postImages.length > 0) {
          const imageInserts = postImages.map((img, index) => {
            return new Promise((resolve) => {
              db.run(
                'INSERT INTO images (postId, imageUrl, imageData, isPrimary, position, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
                [req.params.id, img.imageUrl || '', img.imageData || '', index === 0 ? 1 : 0, index, now],
                () => resolve()
              );
            });
          });

          Promise.all(imageInserts).then(() => {
            updateVersionAndRespond(req.params.id, title, caption, status, now, res);
          });
        } else {
          // Pas d'images, juste mettre à jour la version
          updateVersionAndRespond(req.params.id, title, caption, status, now, res);
        }
      });
    }
  );
});

function updateVersionAndRespond(postId, title, caption, status, now, res) {
  db.run(
    'INSERT INTO versions (postId, date, title, caption, status) VALUES (?, ?, ?, ?, ?)',
    [postId, now, title, caption || '', status],
    (err) => {
      if (err) {
        console.error('Erreur lors de la création de la version:', err);
      }

      db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        db.all('SELECT * FROM versions WHERE postId = ? ORDER BY date ASC', [postId], (err, versions) => {
          db.all('SELECT * FROM images WHERE postId = ? ORDER BY position ASC', [postId], (err2, images) => {
            res.json({ ...post, versions: versions || [], images: images || [] });
          });
        });
      });
    }
  );
}

// PATCH - Mettre à jour uniquement la date de publication (pour le calendrier)
app.patch('/api/posts/:id/date', (req, res) => {
  const { publishDate } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE posts SET publishDate = ?, updatedAt = ? WHERE id = ?',
    [publishDate, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Post non trouvé' });
      }

      res.json({ message: 'Date mise à jour', id: req.params.id, publishDate });
    }
  );
});

// DELETE - Supprimer un post
app.delete('/api/posts/:id', (req, res) => {
  // Supprimer les images associées
  db.run('DELETE FROM images WHERE postId = ?', [req.params.id], (err) => {
    // Supprimer les versions
    db.run('DELETE FROM versions WHERE postId = ?', [req.params.id], (err) => {
      // Supprimer le post
      db.run('DELETE FROM posts WHERE id = ?', [req.params.id], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Post non trouvé' });
        }

        res.json({ message: 'Post supprimé avec succès', id: req.params.id });
      });
    });
  });
});

// POST - Upload d'image unique
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image fournie' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ 
    message: 'Image uploadée avec succès',
    imageUrl,
    filename: req.file.filename
  });
});

// POST - Upload de plusieurs images
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Aucune image fournie' });
  }

  const images = req.files.map(file => ({
    imageUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
    filename: file.filename
  }));

  res.json({ 
    message: 'Images uploadées avec succès',
    images
  });
});

// Export CSV
app.get('/api/export/csv', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY publishDate DESC', [], (err, posts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const headers = ['Titre', 'Plateforme', 'Caption', 'Image URL', 'Prompt IA', 'Statut', 'Date Publication'];
    const rows = posts.map(post => [
      post.title,
      post.platform,
      post.caption,
      post.imageUrl || 'Image uploadée',
      post.aiPrompt,
      post.status,
      post.publishDate
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=social-media-export-${Date.now()}.csv`);
    res.send(csvContent);
  });
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API fonctionnelle' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue!' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);
});

// Fermeture propre de la base de données
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connexion à la base de données fermée');
    process.exit(0);
  });
});