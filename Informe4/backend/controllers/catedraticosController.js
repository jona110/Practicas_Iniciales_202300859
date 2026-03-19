const db = require('../config/db');
 
// GET /api/catedraticos
const getCatedraticos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM catedraticos ORDER BY apellidos ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// POST /api/catedraticos
const createCatedratico = async (req, res) => {
  const { nombres, apellidos, correo } = req.body;
  if (!nombres || !apellidos || !correo)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  try {
    const [result] = await db.query(
      'INSERT INTO catedraticos (nombres, apellidos, correo) VALUES (?, ?, ?)',
      [nombres, apellidos, correo]
    );
    res.status(201).json({ message: 'Catedratico creado', id_catedraticos: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'El correo ya existe' });
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
module.exports = { getCatedraticos, createCatedratico };