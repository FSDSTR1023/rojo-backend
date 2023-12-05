const express = require('express')
const router = express.Router()
const rutinasController = require('../controllers/rutinasController')

router.get('/', rutinasController.getAllRutinas);

router.post('/create', rutinasController.createRutinas);

module.exports = router;