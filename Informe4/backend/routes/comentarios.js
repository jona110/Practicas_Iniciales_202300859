const express = require('express');
const router = express.Router();
const { createComentario } = require('../controllers/comentariosController');
 
router.post('/', createComentario);
 
module.exports = router;