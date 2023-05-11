const bcrypt = require('bcrypt');
const express = require('express');
const routerUsers = express.Router();
const User = require('../models/users.js');
const { jwtSecret } = require('../config.js');
const jwt = require('jsonwebtoken');

/* Crear un usuario y almacenar su contraseña hasheada
routerUsers.post('/newuser', async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const usuario = new User({
      username: req.body.username,
      password: passwordHash,
      role: req.body.role
    });
    await usuario.save();
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

// Iniciar sesión y verificar la contraseña hasheada
routerUsers.post('/login', async (req, res) => {
  try {
    const usuario = await User.findOne({ username: req.body.username });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Crear y devolver el token de acceso JWT
    const token = jwt.sign({ username: usuario.username, role: usuario.role }, jwtSecret);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = routerUsers;
