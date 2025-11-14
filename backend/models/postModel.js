const db = require('../db');

// GET all posts with filters
function getPosts({ status, platform, search, startDate, endDate }, callback) {
  let query = 'SELECT * FROM posts WHERE 1=1';
  const params = [];

  if (status && status !== 'all') { query += ' AND status=?'; params.push(status); }
  if (platform && platform !== 'all') { query += ' AND platform=?'; params.push(platform); }
  if (search) { query += ' AND (title LIKE ? OR caption LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (startDate && endDate) { query += ' AND publishDate BETWEEN ? AND ?'; params.push(startDate, endDate); }

  query += ' ORDER BY publishDate DESC, createdAt DESC';
  db.all(query, params, callback);
}

// GET single post
function getPostById(id, callback) {
  db.get('SELECT * FROM posts WHERE id=?', [id], callback);
}

// CREATE post
function createPost(data, callback) {
  const { id, title, platform, caption, imageUrl, imageData, aiPrompt, status, publishDate, userId, createdAt, updatedAt } = data;
  db.run(
    `INSERT INTO posts (id, title, platform, caption, imageUrl, imageData, aiPrompt, status, publishDate, createdAt, updatedAt, userId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, platform, caption, imageUrl, imageData, aiPrompt, status, publishDate, createdAt, updatedAt, userId],
    callback
  );
}

// UPDATE post
function updatePost(id, data, callback) {
  const { title, platform, caption, imageUrl, imageData, aiPrompt, status, publishDate, updatedAt } = data;
  db.run(
    `UPDATE posts SET title=?, platform=?, caption=?, imageUrl=?, imageData=?, aiPrompt=?, status=?, publishDate=?, updatedAt=? WHERE id=?`,
    [title, platform, caption, imageUrl, imageData, aiPrompt, status, publishDate, updatedAt, id],
    callback
  );
}

// DELETE post
function deletePost(id, callback) {
  db.run('DELETE FROM posts WHERE id=?', [id], callback);
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
