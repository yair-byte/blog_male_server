const express = require('express');
const routerComments = express.Router();
const Comment = require('../models/comments.js');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.js');

// Middlewares
routerComments.use(express.json());

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

// GET - obtener coments por orden asc o desc 
routerComments.get('/', async (req, res) => {
  try {
    const orden = req.query.orden || 'desc'; 
    const comments = await Comment.find();
    if (orden === 'desc') {
        comments.sort((a, b) => b.date - a.date);
    } else if (orden === 'asc') {
        comments.sort((a, b) => a.date - b.date);
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un comentario
routerComments.post('/', async (req, res) => {
  const comment = new Comment({
    name: req.body.name,
    comment: req.body.comment,
    date: new Date(),
    isAdmin: req.body.isAdmin
  });
  try {
    const nuevoComment = await comment.save();
    res.status(201).json(nuevoComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar un comentario
routerComments.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    let commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'No se encontró el comentario' });
    }
    
    // Verificar si el usuario es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerComments;
