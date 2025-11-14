const express = require('express');
const router = express.Router();
const { upload, UPLOADS_PATH } = require('../utils/upload');

router.post('/', upload.single('image'), (req,res)=>{
  if(!req.file) return res.status(400).json({error:'Aucune image fournie'});
  const url=`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({message:'Image uploadée', imageUrl:url, filename:req.file.filename});
});

router.post('/multiple', upload.array('images',10),(req,res)=>{
  if(!req.files || req.files.length===0) return res.status(400).json({error:'Aucune image fournie'});
  const images=req.files.map(f=>({imageUrl:`${req.protocol}://${req.get('host')}/uploads/${f.filename}`,filename:f.filename}));
  res.json({message:'Images uploadées', images});
});

module.exports = router;
