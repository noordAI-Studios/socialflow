const postModel = require('../models/postModel');
const db = require('../db');
const { exportPostsToCSV } = require('../utils/csvExport');
const mediaModel = require('../models/mediaModel');

async function getPosts(req, res) {
  postModel.getPosts(req.query, (err, posts) => {
    if (err) return res.status(500).json({ error: err.message });

    // Récupérer images et versions pour chaque post
    Promise.all(posts.map(post => {
      return new Promise(resolve => {
        db.all('SELECT * FROM images WHERE postId=? ORDER BY position ASC', [post.id], (err, images) => {
          db.all('SELECT * FROM versions WHERE postId=? ORDER BY date ASC', [post.id], (err, versions) => {
            resolve({ ...post, images: images||[], versions: versions||[] });
          });
        });
      });
    })).then(results => res.json(results));
  });
}

async function getPostById(req, res) {
  const id = req.params.id;
  postModel.getPostById(id, (err, post) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    db.all('SELECT * FROM images WHERE postId=? ORDER BY position ASC', [id], (err, images) => {
      db.all('SELECT * FROM versions WHERE postId=? ORDER BY date ASC', [id], (err, versions) => {
        res.json({ ...post, images: images||[], versions: versions||[] });
      });
    });
  });
}

async function createPost(req, res) {
  const now = new Date().toISOString();
  const postId = req.body.id || Date.now().toString();
  const data = { ...req.body, id: postId, createdAt: now, updatedAt: now };
  postModel.createPost(data, err => {
    if (err) return res.status(500).json({ error: err.message });

    // Créer versions et images
    const postImages = req.body.images || [];
    Promise.all(postImages.map((img, i) => {
      return new Promise(resolve => {
        db.run(
          'INSERT INTO images (postId,imageUrl,imageData,isPrimary,position,createdAt) VALUES (?,?,?,?,?,?)',
          [postId,img.imageUrl,img.imageData,i===0?1:0,i,now],
          () => resolve()
        );
      });
    })).then(() => {
      db.run('INSERT INTO versions (postId,date,title,caption,status) VALUES (?,?,?,?,?)',
        [postId, now, req.body.title, req.body.caption||'', req.body.status],
        () => getPostById({ params: { id: postId } }, res)
      );
    });
  });
  // Tracker les médias utilisés
  const images = req.body.images || [];
  for (const img of images) {
    if (img.mediaId) {
      mediaModel.incrementUsage(img.mediaId, postId, () => {});
    }
  }
}  

async function updatePost(req, res) {
  const now = new Date().toISOString();
  const id = req.params.id;
  const data = { ...req.body, updatedAt: now };

  postModel.updatePost(id, data, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes===0) return res.status(404).json({ error: 'Post non trouvé' });

    // Supprimer anciennes images
    db.run('DELETE FROM images WHERE postId=?', [id], () => {
      const postImages = req.body.images || [];
      Promise.all(postImages.map((img,i)=>new Promise(resolve=>{
        db.run('INSERT INTO images (postId,imageUrl,imageData,isPrimary,position,createdAt) VALUES (?,?,?,?,?,?)',
          [id,img.imageUrl,img.imageData,i===0?1:0,i,now],
          ()=>resolve()
        );
      }))).then(()=>{
        db.run('INSERT INTO versions (postId,date,title,caption,status) VALUES (?,?,?,?,?)',
          [id,now,req.body.title,req.body.caption||'',req.body.status],
          ()=>getPostById({ params:{id}}, res)
        );
      });
    });
  });
}

async function deletePost(req,res){
  const id=req.params.id;
  db.run('DELETE FROM images WHERE postId=?',[id],()=>{
    db.run('DELETE FROM versions WHERE postId=?',[id],()=>{
      postModel.deletePost(id,(err)=>{
        if(err) return res.status(500).json({error:err.message});
        res.json({message:'Post supprimé',id});
      });
    });
  });
}

async function exportCSV(req,res){
  db.all('SELECT * FROM posts ORDER BY publishDate DESC',[],(err,posts)=>{
    if(err) return res.status(500).json({error:err.message});
    const csv = exportPostsToCSV(posts);
    res.setHeader('Content-Type','text/csv');
    res.setHeader('Content-Disposition',`attachment; filename=social-media-${Date.now()}.csv`);
    res.send(csv);
  });
}
async function updatePostDate(req, res) {
  const id = req.params.id;
  const { publishDate } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE posts SET publishDate=?, updatedAt=? WHERE id=?',
    [publishDate, now, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Post non trouvé' });
      }

      return res.json({
        message: 'Date mise à jour',
        id,
        publishDate
      });
    }
  );
}
module.exports = { getPosts, getPostById, createPost, updatePost, deletePost, exportCSV, updatePostDate };
