const express = require('express');
const routerItems = express.Router();
const Items = require('../models/items.js');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config.js');

// Middlewares
routerItems.use(express.json());

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

async function getItem(req, res, next) {  // Obtener un item por ID
  let item;
  try {
    item = await Items.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'No se encontró el item' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.item = item;
  next();
};

// GET - obtener items por orden asc o desc 
routerItems.get('/', async (req, res) => {
  try {
    const orden = req.query.orden || 'desc';
    const items = await Items.find();

    if (orden === 'desc') {
      items.sort((a, b) => b.date - a.date);
    } else if (orden === 'asc') {
      items.sort((a, b) => a.date - b.date);
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un item nuevo
routerItems.post('/', async (req, res) => {
  const item = new Items({
    date: new Date(),
    imageSrc: req.body.imageSrc,
    imageAlt: req.body.imageAlt,
    title: req.body.title,
    description: req.body.description,
    fullDescription: req.body.fullDescription
  });
  try {
    const nuevoItem = await item.save();
    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Actualizar un item
routerItems.put('/:id', getItem, verifyAdmin, async (req, res) => {
  res.item.date = new Date();
  res.item.imageSrc = '';
  res.item.imageAlt = 'img';
  res.item.title = '';
  res.item.description = '';
  res.item.fullDescription = '';

  if (req.body.date != null) {
    res.item.date = req.body.date;
  }
  if (req.body.imageSrc != null) {
    res.item.imageSrc = req.body.imageSrc;
  }
  if (req.body.imageAlt != null) {
    res.item.imageAlt = req.body.imageAlt;
  }
  if (req.body.title != null) {
    res.item.title = req.body.title;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.fullDescription != null) {
    res.item.fullDescription = req.body.fullDescription;
  }

  // Verificar si el usuario es admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const itemActualizado = await res.item.save();
    res.status(200).json(itemActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar un item
routerItems.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    const item = await Items.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'No se encontró el item' });
    }

    // Verificar si el usuario es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await Items.findByIdAndDelete(id);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerItems;
