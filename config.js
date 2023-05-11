const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_bd',
  PORT: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET
};
