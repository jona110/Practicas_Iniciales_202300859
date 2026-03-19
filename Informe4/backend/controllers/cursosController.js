const db = require('../config/db');
 
// GET /api/cursos
const getCursos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM curso ORDER BY nombre_curso ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// POST /api/cursos
const createCurso = async (req, res) => {
  const { nombre_curso, creditos, area } = req.body;
  if (!nombre_curso || !area)
    return res.status(400).json({ message: 'nombre_curso y area son requeridos' });
  try {
    const [result] = await db.query(
      'INSERT INTO curso (nombre_curso, creditos, area) VALUES (?, ?, ?)',
      [nombre_curso, creditos || 5, area]
    );
    res.status(201).json({ message: 'Curso creado', id_curso: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
module.exports = { getCursos, createCurso };