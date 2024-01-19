const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')

// GET
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)

// POST
router.post('/', recipeController.createRecipe)
router.post('/', recipeController.markRecipeAsFavorite)

// PUT
router.put('/:id', recipeController.updateRecipe)

// PATCH
router.patch('/opinion/add/:id', recipeController.addOpinion)
router.patch('/opinion/delete/:id', recipeController.deleteOpinion)

// DELETE
router.delete('/:id', recipeController.deleteRecipe)

module.exports = router
