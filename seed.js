const dotenv = require('dotenv')
const fs = require('fs')
const colors = require('colors')
const db = require('./config/db')
const bcrypt = require('bcrypt')

//Load models
const Recipe = require('./models/recipe.model')
const User = require('./models/user.model')

//Connect to db
db().then()

// Import sample data in DB
const importData = async () => {
  try {
    // Read the JSON files
    const recipes = JSON.parse(fs.readFileSync('./data/recipe.data.json', 'utf-8'))
    const users = JSON.parse(fs.readFileSync('./data/user.data.json', 'utf-8'))

    // Encrypt passwords
    const saltRounds = 10
    const encryptedUsers = users.map((user) => {
      const encryptedPassword = bcrypt.hashSync(user.password, saltRounds)
      return { ...user, password: encryptedPassword }
    })

    // Create ussers
    await User.create(encryptedUsers)

    // Assign random user
    const createdUsers = await User.find()
    const recipesWithUser = recipes.map((recipe) => {
      const randomIndex = Math.floor(Math.random() * createdUsers.length)
      const author = createdUsers[randomIndex]._id
      return { ...recipe, author }
    })

    // Create recipes
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
