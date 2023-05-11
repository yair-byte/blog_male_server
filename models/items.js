const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({

  date: {
    type: Date,
    required: true
  },
  imageSrc: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Items', itemsSchema, 'items');   //ultimo parametro es el nombre de la coleccion