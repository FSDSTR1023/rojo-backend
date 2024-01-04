const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.getAllUsers)

router.get('/:id', userController.getUserById)

router.put('/:id', userController.updateUser)

router.post('/', userController.createUser)

router.post('/login', userController.loginUser)

router.delete('/:id', userController.deleteUser)

router.patch('/follow', userController.followUser)

module.exports = router
