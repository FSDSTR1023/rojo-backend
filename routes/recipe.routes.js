const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
const recipeMiddleware = require('../middlewares/recipe.middleware')

// Definición de las rutas usando el router
router.get('/', recipeController.getAllRecipes)
router.get('/:id', recipeController.getRecipeById)
router.post('/', recipeController.createRecipe)
router.put('/:id', recipeController.updateRecipe)
router.delete('/:id', recipeController.deleteRecipe)

module.exports = router
