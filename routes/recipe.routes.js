const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')

router.get('/', recipeController.getAllRecipes);

router.post('/create', recipeController.createRecipe);

router.put('/update/:id', recipeController.updateRecipe);

router.get('/:id', recipeController.getRecipeById);

router.delete('/delete/:id', recipeController.deleteRecipe);

module.exports = router;
