const Recipe = require('../models/recipe.model')

async function createRecipe(req, res) {
  Recipe.create(req.body)
    .then((recipes) => {
      console.log('recetas creadas', recipes)
      res.status(200).json(recipes)
    })
    .catch((err) => {
      console.log(err, 'error y que intentes denuevo por que algo fue mal')
      res.status(400).json(err)
    })
}

async function getAllRecipes(req, res) {
  Recipe.find(res.filters)
    .then((recipes) => {
      //console.log('all recipes found', recipes)
      res.status(200).json(recipes)
    })
    .catch((err) => {
      console.log(err, 'all recipes not found, try again')
      res.status(400).json(err)
    })
}

async function updateRecipe(req, res) {
  Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((recipes) => {
      console.log('recipe updated', recipes)
      res.status(200).json(recipes)
    })
    .catch((err) => {
      console.log(err, 'recipe not updated, try again')
      res.status(400).son(err)
    })
}

async function getRecipeById(req, res) {
  Recipe.findById(req.params.id)
    .then((recipes) => {
      console.log('recipe found')
      res.status(200).json(recipes)
    })
    .catch((err) => {
      console.log(err, 'recipe not found, try again')
      res.status(400).json(err)
    })
}

async function deleteRecipe(req, res) {
  Recipe.findByIdAndDelete(req.params.id)
    .then((recipes) => {
      console.log('recipe deleted')
      res.status(200).json(recipes)
    })
    .catch((err) => {
      console.log(err, 'recipe not deleted')
      res.status(400).json(err)
    })
}

module.exports = { createRecipe, getAllRecipes, updateRecipe, getRecipeById, deleteRecipe }
