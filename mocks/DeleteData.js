//Load models
const Recipe = require('../models/recipe.model')
const User = require('../models/user.model')

const deleteData = async () => {
  await User.deleteMany()
  await Recipe.deleteMany()
}

module.exports = deleteData
