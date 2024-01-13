const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { auth } = require('../middlewares/auth.middleware')

// GET
router.get('/', auth, userController.getAllUsers)
router.get('/:id', auth, userController.getUserById)

// POST
router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/favorite', auth, userController.addFavoriteRecipe)

// PUT
router.put('/:id', auth, userController.updateUser)

// PATCH
router.patch('/follow', auth, userController.followUser)

// DELETE
router.delete('/:id', auth, userController.deleteUser)
router.delete('/', auth, userController.removeFavoriteRecipe)

module.exports = router
