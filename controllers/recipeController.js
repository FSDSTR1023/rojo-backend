const Recipe = require('../models/recipe.model')

async function createRecipe(req, res) {
  Recipe.create(req.body)
    .then((recipes) => {
      res.status(201).json(recipes)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function getAllRecipes(req, res) {
  Recipe.find(res.filters)
    .then((recipes) => {
      res.status(200).json(recipes)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function updateRecipe(req, res) {
  Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((recipes) => {
      res.status(200).json(recipes)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function getRecipeById(req, res) {
  Recipe.findById(req.params.id)
    .then((recipes) => {
      res.status(200).json(recipes)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function deleteRecipe(req, res) {
  Recipe.findByIdAndDelete(req.params.id)
    .then((recipes) => {
      res.status(200).json(recipes)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function addOpinion(req, res) {
  const { text, rating, user } = req.body
  const opinion = { text, rating, user }

  try {
    // Get current recipe
    const recipe = await Recipe.findById(req.params.id)

    // Update rating with new opinion rating
    const opinionsLength = recipe.opinions.length
    const currentRating = recipe.rating
    const newRating = (currentRating * opinionsLength + rating) / (opinionsLength + 1)

    // Add comment to the array and update rating
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { opinions: opinion }, rating: newRating },
      { new: true },
    )

    // Extract updated values
    const updatedOpinion = updatedRecipe.opinions.pop()
    const updatedRating = updatedRecipe.rating

    // Send response
    res.status(200).json({
      msg: 'Opinion added successfully',
      updatedOpinion,
      updatedRating,
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

module.exports = { createRecipe, getAllRecipes, updateRecipe, getRecipeById, deleteRecipe, addOpinion }
