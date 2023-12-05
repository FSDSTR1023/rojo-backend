const express = require('express')
const router = express.Router()
const recetasController = require('../controllers/recetasController')

router.get('/', recetasController.getAllRecetas);

router.post('/create', recetasController.createRecetas);

module.exports = router;
