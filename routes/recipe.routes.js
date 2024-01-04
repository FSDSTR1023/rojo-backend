const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')

// GET
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)

// POST
router.post('/', recipeController.createRecipe)

// PUT
router.put('/:id', recipeController.updateRecipe)

// PATCH
router.patch('/opinion/:id', recipeController.addOpinion)

// DELETE
router.delete('/:id', recipeController.deleteRecipe)

module.exports = router
