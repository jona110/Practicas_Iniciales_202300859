const express = require('express');
const router = express.Router();
const { getUsuario, updateUsuario, getCursosAprobados, addCursoAprobado, deleteCursoAprobado } = require('../controllers/usuariosController');
 
router.get('/:registro_academico', getUsuario);
router.put('/:id_usuario', updateUsuario);
router.get('/:id_usuario_curapro/cursos-aprobados', getCursosAprobados);
router.post('/:id_usuario_curapro/cursos-aprobados', addCursoAprobado);
router.delete('/:id_usuario_curapro/cursos-aprobados/:id_registro', deleteCursoAprobado);
 
module.exports = router;