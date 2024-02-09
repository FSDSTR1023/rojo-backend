const { DIFFICULTY, PREPARATION_TIME, CATEGORIES } = require('../constants/recipe.js')

function filters(req, res, next) {
  const { author, difficulty, preparationTime, categories } = req.query

  const verifiedCategories =
    typeof req.query.categories === 'object'
      ? categories.filter((category) => CATEGORIES.includes(category))
      : CATEGORIES.includes(categories) && [categories]

  res.filters = {
    ...(author && { author }),
    ...(DIFFICULTY.includes(difficulty) && { difficulty }),
    ...(PREPARATION_TIME.includes(preparationTime) && { preparationTime }),
    ...(verifiedCategories && { categories: { $all: verifiedCategories } }),
  }
  console.log(res.filters)
  next()
}

module.exports = { filters }

// Filters
// Category

// Title

// Ingredients

// Rating

// Order
// Rating
// Date
