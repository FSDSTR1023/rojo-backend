const { DIFFICULTY, PREPARATION_TIME, CATEGORIES } = require('../constants/recipe.js')

function filters(req, res, next) {
  const { author, difficulty, preparationTime, categories, ingredients, minRating, maxRating, title } = req.query

  const verifiedCategories =
    typeof req.query.categories === 'object'
      ? categories.filter((category) => CATEGORIES.includes(category))
      : CATEGORIES.includes(categories) && [categories]

  req.filters = {
    ...(title && { title: { $regex: new RegExp(title, 'i') } }),
    ...(author && { author }),
    ...(DIFFICULTY.includes(difficulty) && { difficulty }),
    ...(PREPARATION_TIME.includes(preparationTime) && { preparationTime }),
    ...(verifiedCategories && { categories: { $all: verifiedCategories } }),
    ...(ingredients && { ingredients: { $all: ingredients } }),
    ...((minRating || maxRating) && {
      rating: {
        ...(minRating && { $gte: parseFloat(minRating) }),
        ...(maxRating && { $lte: parseFloat(maxRating) }),
      },
    }),
  }

  next()
}

module.exports = { filters }

// Filters
// Title

// Order
// Rating
// Date
