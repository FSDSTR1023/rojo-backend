const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { auth } = require('../middlewares/auth.middleware')

router.get('/', auth, userController.getAllUsers)

router.get('/:id', auth, userController.getUserById)

router.put('/:id', auth, userController.updateUser)

router.post('/', userController.createUser)

router.post('/login', userController.loginUser)

router.delete('/:id', auth, userController.deleteUser)

module.exports = router
