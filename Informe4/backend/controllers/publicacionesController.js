const db = require('../config/db');
 
// GET /api/publicaciones  (con filtros opcionales)
const getPublicaciones = async (req, res) => {
  const { id_curso, id_catedratico, nombre_curso, nombre_catedratico } = req.query;
  try {
    let query = `
      SELECT p.id_publicacion, p.mensaje, p.fecha,
             u.nombres AS usuario_nombres, u.apellidos AS usuario_apellidos, u.registro_academico,
             c.nombre_curso, c.area,
             CONCAT(cat.nombres, ' ', cat.apellidos) AS nombre_catedratico
      FROM publicacion p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN curso c ON p.id_curso = c.id_curso
      LEFT JOIN catedraticos cat ON p.id_catedratico = cat.id_catedraticos
      WHERE 1=1
    `;
    const params = [];
 
    if (id_curso) { query += ' AND p.id_curso = ?'; params.push(id_curso); }
    if (id_catedratico) { query += ' AND p.id_catedratico = ?'; params.push(id_catedratico); }
    if (nombre_curso) { query += ' AND c.nombre_curso LIKE ?'; params.push(`%${nombre_curso}%`); }
    if (nombre_catedratico) {
      query += ' AND CONCAT(cat.nombres, " ", cat.apellidos) LIKE ?';
      params.push(`%${nombre_catedratico}%`);
    }
 
    query += ' ORDER BY p.fecha DESC';
 
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// GET /api/publicaciones/:id
const getPublicacion = async (req, res) => {
  const { id } = req.params;
  try {
    const [pub] = await db.query(
      `SELECT p.*, u.nombres, u.apellidos, u.registro_academico,
              c.nombre_curso, CONCAT(cat.nombres, ' ', cat.apellidos) AS nombre_catedratico
       FROM publicacion p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       LEFT JOIN curso c ON p.id_curso = c.id_curso
       LEFT JOIN catedraticos cat ON p.id_catedratico = cat.id_catedraticos
       WHERE p.id_publicacion = ?`,
      [id]
    );
    if (pub.length === 0) return res.status(404).json({ message: 'Publicacion no encontrada' });
 
    const [comentarios] = await db.query(
      `SELECT com.*, u.nombres, u.apellidos, u.registro_academico
       FROM comentario com
       JOIN usuarios u ON com.id_usuario_com = u.id_usuario
       WHERE com.id_publicacion = ?
       ORDER BY com.fecha ASC`,
      [id]
    );
 
    res.json({ ...pub[0], comentarios });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// POST /api/publicaciones
const createPublicacion = async (req, res) => {
  const { id_usuario, id_curso, id_catedratico, mensaje, fecha } = req.body;
  if (!id_usuario || !mensaje || !fecha)
    return res.status(400).json({ message: 'id_usuario, mensaje y fecha son requeridos' });
  if (!id_curso && !id_catedratico)
    return res.status(400).json({ message: 'Debe indicar un curso o catedratico' });
  try {
    const [result] = await db.query(
      'INSERT INTO publicacion (id_usuario, id_curso, id_catedratico, mensaje, fecha) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, id_curso || null, id_catedratico || null, mensaje, fecha]
    );
    res.status(201).json({ message: 'Publicacion creada', id_publicacion: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
module.exports = { getPublicaciones, getPublicacion, createPublicacion };