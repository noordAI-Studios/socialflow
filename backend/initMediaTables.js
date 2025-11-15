// Script pour initialiser les tables de la Media Library
// À exécuter une seule fois: node initMediaTables.js

const db = require('./db');

const tables = [
  // Table principale des médias
  `CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    fileUrl TEXT NOT NULL,
    thumbnailUrl TEXT,
    fileSize INTEGER NOT NULL,
    mimeType TEXT NOT NULL,
    mediaType TEXT NOT NULL CHECK(mediaType IN ('image', 'video')),
    width INTEGER,
    height INTEGER,
    duration REAL,
    uploadedAt TEXT NOT NULL,
    userId TEXT
  )`,

  // Table des shootings
  `CREATE TABLE IF NOT EXISTS shootings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    coverMediaId TEXT,
    createdAt TEXT NOT NULL,
    userId TEXT
  )`,

  // Table des métadonnées
  `CREATE TABLE IF NOT EXISTS media_metadata (
    mediaId TEXT PRIMARY KEY,
    shootingId TEXT,
    tags TEXT,
    isFavorite INTEGER DEFAULT 0,
    usageCount INTEGER DEFAULT 0,
    lastUsedAt TEXT,
    notes TEXT,
    FOREIGN KEY (mediaId) REFERENCES media(id) ON DELETE CASCADE,
    FOREIGN KEY (shootingId) REFERENCES shootings(id) ON DELETE SET NULL
  )`,

  // Table de liaison media <-> posts
  `CREATE TABLE IF NOT EXISTS media_posts (
    id TEXT PRIMARY KEY,
    mediaId TEXT NOT NULL,
    postId TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (mediaId) REFERENCES media(id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(mediaId, postId)
  )`
];

const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_media_type ON media(mediaType)',
  'CREATE INDEX IF NOT EXISTS idx_media_uploaded ON media(uploadedAt DESC)',
  'CREATE INDEX IF NOT EXISTS idx_media_user ON media(userId)',
  'CREATE INDEX IF NOT EXISTS idx_metadata_shooting ON media_metadata(shootingId)',
  'CREATE INDEX IF NOT EXISTS idx_metadata_favorite ON media_metadata(isFavorite)',
  'CREATE INDEX IF NOT EXISTS idx_media_posts_media ON media_posts(mediaId)',
  'CREATE INDEX IF NOT EXISTS idx_media_posts_post ON media_posts(postId)'
];

function initTables() {
  console.log('🚀 Initialisation des tables Media Library...\n');

  db.serialize(() => {
    // Créer les tables
    tables.forEach((sql, i) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erreur table ${i + 1}:`, err.message);
        } else {
          console.log(`✅ Table ${i + 1}/${tables.length} créée`);
        }
      });
    });

    // Créer les index
    indexes.forEach((sql, i) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erreur index ${i + 1}:`, err.message);
        } else {
          console.log(`✅ Index ${i + 1}/${indexes.length} créé`);
        }
      });
    });

    // Vérifier les tables
    db.all(
      `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'media%' OR name='shootings'`,
      [],
      (err, rows) => {
        if (err) {
          console.error('❌ Erreur vérification:', err.message);
        } else {
          console.log('\n📊 Tables créées:');
          rows.forEach(row => console.log(`   - ${row.name}`));
          console.log('\n✨ Initialisation terminée!\n');
        }
        
        db.close();
      }
    );
  });
}

// Exécuter
initTables();