const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config.js');

mongoose.connect(MONGODB_URI)
  .then(db => console.log('conectado a la BD'))
  .catch(error => console.error(error));

module.exports = mongoose;
