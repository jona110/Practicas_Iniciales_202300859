const db = require('../config/db');
const bcrypt = require('bcryptjs');
 
// GET /api/usuarios/:registro_academico
const getUsuario = async (req, res) => {
  const { registro_academico } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_usuario, registro_academico, nombres, apellidos, correo FROM usuarios WHERE registro_academico = ?',
      [registro_academico]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// PUT /api/usuarios/:id_usuario
const updateUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { nombres, apellidos, correo, contrasena } = req.body;
  try {
    if (contrasena) {
      const hash = await bcrypt.hash(contrasena, 10);
      await db.query(
        'UPDATE usuarios SET nombres=?, apellidos=?, correo=?, contrasena=? WHERE id_usuario=?',
        [nombres, apellidos, correo, hash, id_usuario]
      );
    } else {
      await db.query(
        'UPDATE usuarios SET nombres=?, apellidos=?, correo=? WHERE id_usuario=?',
        [nombres, apellidos, correo, id_usuario]
      );
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// GET /api/usuarios/:id_usuario/cursos-aprobados
const getCursosAprobados = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT ca.id_registro, c.nombre_curso, c.creditos, c.area, ca.fecha_aprobacion
       FROM curso_aprobado ca
       JOIN curso c ON ca.id_curso = c.id_curso
       WHERE ca.id_usuario = ?`,
      [id_usuario]
    );
    const totalCreditos = rows.reduce((sum, r) => sum + r.creditos, 0);
    res.json({ cursos: rows, total_creditos: totalCreditos });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// POST /api/usuarios/:id_usuario/cursos-aprobados
const addCursoAprobado = async (req, res) => {
  const { id_usuario } = req.params;
  const { id_curso, fecha_aprobacion } = req.body;
  if (!id_curso || !fecha_aprobacion)
    return res.status(400).json({ message: 'id_curso y fecha_aprobacion son requeridos' });
  try {
    await db.query(
      'INSERT INTO curso_aprobado (id_usuario, id_curso, fecha_aprobacion) VALUES (?, ?, ?)',
      [id_usuario, id_curso, fecha_aprobacion]
    );
    res.status(201).json({ message: 'Curso aprobado registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
// DELETE /api/usuarios/:id_usuario/cursos-aprobados/:id_registro
const deleteCursoAprobado = async (req, res) => {
  const { id_registro } = req.params;
  try {
    await db.query('DELETE FROM curso_aprobado WHERE id_registro = ?', [id_registro]);
    res.json({ message: 'Curso aprobado eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
module.exports = { getUsuario, updateUsuario, getCursosAprobados, addCursoAprobado, deleteCursoAprobado };