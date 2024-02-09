const { DIFFICULTY, PREPARATION_TIME, CATEGORIES } = require('../constants/recipe.js')

function filters(req, res, next) {
  const { author, difficulty, preparationTime, categories, ingredients } = req.query

  const verifiedCategories =
    typeof req.query.categories === 'object'
      ? categories.filter((category) => CATEGORIES.includes(category))
      : CATEGORIES.includes(categories) && [categories]

  res.filters = {
    ...(author && { author }),
    ...(DIFFICULTY.includes(difficulty) && { difficulty }),
    ...(PREPARATION_TIME.includes(preparationTime) && { preparationTime }),
    ...(verifiedCategories && { categories: { $all: verifiedCategories } }),
    ...(ingredients && { ingredients: { $all: ingredients } }),
  }
  console.log(res.filters)
  next()
}

module.exports = { filters }

// Filters
// Title
// Rating

// Order
// Rating
// Date
