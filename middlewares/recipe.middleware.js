const { DIFFICULTY, PREPARATION_TIME, CATEGORIES } = require('../constants/recipe.js')

function filters(req, res, next) {
  const { author, difficulty, preparationTime } = req.query
  res.filters = {
    ...(author && { author }),
    ...(DIFFICULTY.includes(difficulty) && { difficulty }),
    ...(PREPARATION_TIME.includes(preparationTime) && { preparationTime }),
  }
  next()
}

module.exports = { filters }

// Filters
// Category

// Title

// Ingredients

// Dificulty

// Preparation Time

// Rating

// Order
// Rating
// Date
