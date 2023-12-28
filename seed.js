const dotenv = require('dotenv')
const fs = require('fs')
const colors = require('colors')
const db = require('./config/db')

//Load models
const Recipe = require('./models/recipe.model')
const User = require('./models/user.model')

//Connect to db
db().then()

// Read the JSON files
const recipes = JSON.parse(fs.readFileSync('./data/recipe.data.json', 'utf-8'))
const users = JSON.parse(fs.readFileSync('./data/user.data.json', 'utf-8'))

// Import sample data in DB
const importData = async () => {
  try {
    await User.create(users)

    // Assign random user
    const createdUsers = await User.find()
    const recipesWithUser = recipes.map((recipe) => {
      const randomIndex = Math.floor(Math.random() * createdUsers.length)
      const author = createdUsers[randomIndex]._id
      return { ...recipe, author }
    })

    await Recipe.create(recipesWithUser)

    console.log(`Data successfully imported`.green.inverse)
  } catch (err) {
    console.log(err)
  } finally {
    process.exit()
  }
}

// Delete the data from DB
const deleteData = async () => {
  try {
    await User.deleteMany()
    await Recipe.deleteMany()
    console.log(`Data successfully deleted`.red.inverse)
  } catch (err) {
    console.log(err)
  } finally {
    process.exit()
  }
}

// Select operation
switch (process.argv[2]) {
  case '-i':
    importData().then()
    break
  case '-d':
    deleteData().then()
    break
  default:
    console.log(`Wrong parameter assigned`.yellow.inverse)
    process.exit()
}
