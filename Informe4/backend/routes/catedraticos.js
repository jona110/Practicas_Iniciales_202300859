const express = require('express');
const router = express.Router();
const { getCatedraticos, createCatedratico } = require('../controllers/catedraticosController');
 
router.get('/', getCatedraticos);
router.post('/', createCatedratico);
 
module.exports = router;