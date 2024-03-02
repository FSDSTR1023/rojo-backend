const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const { auth } = require('../middlewares/auth.middleware')

// GET
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)

// POST
router.post('/', auth, recipeController.createRecipe)

// PUT
router.put('/:id', auth, recipeController.updateRecipe)

// PATCH
router.patch('/opinion/add/:id', auth, recipeController.addOpinion)
router.patch('/opinion/delete/:id', auth, recipeController.deleteOpinion)
router.patch('/opinion/update/:id', auth, recipeController.updateOpinion)

// DELETE
router.delete('/:id', auth, recipeController.deleteRecipe)

module.exports = router
