const Recipe = require('../models/recipe.model')
const User = require('../models/user.model')

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
    .populate({ path: 'opinions.user', select: 'userName imageUrl' })
    .exec()
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
  const { text, rating } = req.body
  const user = req.userId
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

async function deleteOpinion(req, res) {
  const recipeId = req.params.id
  const opinionId = req.body.opinionId

  try {
    // Get current recipe
    const recipe = await Recipe.findById(recipeId)

    const opinion = recipe.opinions.find((o) => o._id.toString() === opinionId)
    const rating = opinion.rating

    // Update rating with new opinion rating
    const opinionsLength = recipe.opinions.length
    const currentRating = recipe.rating
    const newRating = (currentRating * opinionsLength - rating) / (opinionsLength - 1)

    // Delete opinion from the array and update rating
    await Recipe.findByIdAndUpdate(recipeId, { $pull: { opinions: { _id: opinionId } }, rating: newRating })

    // Send response
    res.status(200).json({
      msg: 'Opinion deleted successfully',
      updatedRating: newRating,
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

async function updateOpinion(req, res) {
  const recipeId = req.params.id
  const { text, rating, opinionId } = req.body
  const { user } = req.userId

  try {
    // Get current recipe
    const recipe = await Recipe.findById(recipeId)
    const opinion = recipe.opinions.find((o) => o._id.toString() === opinionId)

    // Update rating with new opinion rating
    const opinionRating = opinion.rating
    const opinionsLength = recipe.opinions.length
    const currentRating = recipe.rating
    const newRating = (currentRating * opinionsLength - opinionRating + rating) / opinionsLength

    // Delete opinion from the array and update rating
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, 'opinions._id': opinionId },
      { $set: { rating: newRating, 'opinions.$.text': text, 'opinions.$.rating': rating, 'opinions.$.user': user } },
      { new: true },
    )

    // Updated opinion
    const updatedOpinion = updatedRecipe.opinions.find((o) => o._id.toString() === opinionId)
    const updatedRating = updatedRecipe.rating

    // Send response
    res.status(200).json({
      msg: 'Opinion updated successfully',
      updatedOpinion,
      updatedRating,
    })
  } catch (err) {
    res.status(400).json({ msg: `Error updating comment: ${err}` })
  }
}

async function markRecipeAsFavorite(req, res) {
  const { userId, recipeId } = req.body

  try {
    // Verifica si la receta existe
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' })
    }

    // Agrega la receta a la lista de favoritos del usuario
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { favRecipes: recipeId } }, { new: true })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.status(200).json({ msg: 'Recipe marked as favorite successfully', user })
  } catch (err) {
    res.status(400).json(err)
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  updateRecipe,
  getRecipeById,
  deleteRecipe,
  addOpinion,
  deleteOpinion,
  updateOpinion,
  markRecipeAsFavorite,
}
