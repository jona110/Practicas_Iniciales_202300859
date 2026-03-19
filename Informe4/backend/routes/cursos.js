const express = require('express');
const router = express.Router();
const { getCursos, createCurso } = require('../controllers/cursosController');
 
router.get('/', getCursos);
router.post('/', createCurso);
 
module.exports = router;