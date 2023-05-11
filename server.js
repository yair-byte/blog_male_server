const express = require('express');
const app = express();
const { mongoose } = require('./database/database.js');
const { PORT } = require('./config.js');
const BASE_URL = `http://localhost`;
const cors = require('cors');

// Middlewares
app.use(express.json());
app.use(cors());

// Routers
const routerComments = require('./routers/comments_routes.js');
const routerDescription = require('./routers/description_routes.js');
const routerItems = require('./routers/items_routes.js');
const routerUsers = require('./routers/users_routes.js');
app.use('/api/comentarios', routerComments);
app.use('/api/descripcion', routerDescription);
app.use('/api/items', routerItems);
app.use('/api/usuarios', routerUsers);

// Routing
app.get('/', (req, res) => {
  res.send('server');        
});

//start server
app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en ${BASE_URL}:${PORT}...`);      
});
