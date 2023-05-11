const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Comment', commentSchema, 'comment');   //ultimo parametro es el nombre de la coleccion