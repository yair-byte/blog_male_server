const mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Description', descriptionSchema, 'description');   //ultimo parametro es el nombre de la coleccion