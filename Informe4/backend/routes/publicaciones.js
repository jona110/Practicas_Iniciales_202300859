const express = require('express');
const router = express.Router();
const { getPublicaciones, getPublicacion, createPublicacion } = require('../controllers/publicacionesController');
 
router.get('/', getPublicaciones);
router.get('/:id', getPublicacion);
router.post('/', createPublicacion);
 
module.exports = router;