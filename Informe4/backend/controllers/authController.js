const db = require('../config/db');
const bcrypt = require('bcryptjs');
 
const register = async (req, res) => {
  const { registro_academico, nombres, apellidos, correo, contrasena } = req.body;
  if (!registro_academico || !nombres || !apellidos || !correo || !contrasena)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  try {
    const hash = await bcrypt.hash(contrasena, 10);
    await db.query(
      'INSERT INTO usuarios (registro_academico, nombres, apellidos, correo, contrasena) VALUES (?, ?, ?, ?, ?)',
      [registro_academico, nombres, apellidos, correo, hash]
    );
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'El registro academico o correo ya existe' });
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
const login = async (req, res) => {
  const { registro_academico, contrasena } = req.body;
  if (!registro_academico || !contrasena)
    return res.status(400).json({ message: 'Registro academico y contrasena son requeridos' });
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE registro_academico = ?', [registro_academico]);
    if (rows.length === 0) return res.status(401).json({ message: 'Credenciales incorrectas' });
    const usuario = rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) return res.status(401).json({ message: 'Credenciales incorrectas' });
    const { contrasena: _, ...usuarioSinPass } = usuario;
    res.json({ message: 'Login exitoso', usuario: usuarioSinPass });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
const resetPassword = async (req, res) => {
  const { registro_academico, correo, nueva_contrasena } = req.body;
  if (!registro_academico || !correo || !nueva_contrasena)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE registro_academico = ? AND correo = ?',
      [registro_academico, correo]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Los datos ingresados son incorrectos' });
    const hash = await bcrypt.hash(nueva_contrasena, 10);
    await db.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [hash, rows[0].id_usuario]);
    res.json({ message: 'Contrasena actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};
 
module.exports = { register, login, resetPassword };