const express = require('express');
const routerDescription = express.Router();
const Description = require('../models/description.js');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.js');

// Middlewares
routerDescription.use(express.json());

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

async function getDescription(req, res, next) {  // Obtener la desc por ID
  let descr;
  try {
    descr = await Description.findById(req.params.id);
    if (descr == null) {
      return res.status(404).json({ message: 'No se encontró la descripcion' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.descr = descr;
  next();
}

// GET - Obtener la descrip
routerDescription.get('/', async (req, res) => {
  try {
    const descrip = await Description.find();
    res.status(200).json(descrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Actualizar 
routerDescription.put('/:id', getDescription, verifyAdmin, async (req, res) => {
  res.descr.titulo = "";
  res.descr.texto = "";

  if (req.body.titulo != null) {
    res.descr.titulo = req.body.titulo;
  }
  if (req.body.texto != null) {
    res.descr.texto = req.body.texto;
  }

  // Verificar si el usuario es admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const descActualizado = await res.descr.save();
    res.status(200).json(descActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerDescription;
