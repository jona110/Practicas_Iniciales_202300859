const db = require('../config/db');
 
// POST /api/comentarios
const createComentario = async (req, res) => {
  const { id_publicacion, id_usuario_com, mensaje, fecha } = req.body;
  if (!id_publicacion || !id_usuario_com || !mensaje || !fecha)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  try {
    const [result] = await db.query(
      'INSERT INTO comentario (id_publicacion, id_usuario_com, mensaje, fecha) VALUES (?, ?, ?, ?)',
      [id_publicacion, id_usuario_com, mensaje, fecha]
    );
    res.status(201).json({ message: 'Comentario creado', id_comentario: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
module.exports = { createComentario };