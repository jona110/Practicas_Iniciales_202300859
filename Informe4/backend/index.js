const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_USER:', process.env.DB_USER);
const express = require('express');
const cors = require('cors');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// Middlewares
app.use(cors());
app.use(express.json());
 
// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/publicaciones', require('./routes/publicaciones'));
app.use('/api/comentarios', require('./routes/comentarios'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/catedraticos', require('./routes/catedraticos'));
 
// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Practica Web USAC funcionando correctamente' });
});
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});