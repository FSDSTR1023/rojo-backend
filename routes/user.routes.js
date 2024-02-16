const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const mailController = require('../controllers/mailController')
const { auth } = require('../middlewares/auth.middleware')

// GET
router.get('/', auth, userController.getAllUsers)
router.get('/authWithToken', auth, userController.checkAuthToken)
router.get('/:id', auth, userController.getUserById)

// POST
router.post('/', userController.createUser)
router.post('/new-email', mailController.sendEmail)
router.post('/login', userController.loginUser)
router.post('/logout', userController.logoutUser)

// PUT
router.put('/:id', auth, userController.updateUser)

// PATCH
router.patch('/follower/add/:id', auth, userController.addFollower)
router.patch('/follower/remove/:id', auth, userController.removeFollower)
router.patch('/favorite/add/:id', auth, userController.addFavoriteRecipe)
router.patch('/favorite/remove/:id', auth, userController.removeFavoriteRecipe)

// DELETE
router.delete('/:id', auth, userController.deleteUser)

module.exports = router
