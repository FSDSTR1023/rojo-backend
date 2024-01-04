const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// GET
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

// POST
router.post('/', userController.createUser)
router.post('/login', userController.loginUser)

// PUT
router.put('/:id', userController.updateUser)

// PATCH
router.patch('/follow', userController.followUser)

// DELETE
router.delete('/:id', userController.deleteUser)

module.exports = router
