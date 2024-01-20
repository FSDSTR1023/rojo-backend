const dotenv = require('dotenv')
const fs = require('fs')
const colors = require('colors')
const db = require('./config/db')
const bcrypt = require('bcrypt')
const random = require('./utils/random.js')

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
    const opinions = JSON.parse(fs.readFileSync('./data/opinion.data.json', 'utf-8'))

    // Encrypt passwords
    const saltRounds = 10
    const encryptedUsers = users.map((user) => {
      const encryptedPassword = bcrypt.hashSync(user.password, saltRounds)
      return { ...user, password: encryptedPassword }
    })

    // Create ussers
    await User.create(encryptedUsers)
    const createdUsers = await User.find()

    // Add random followers
    const usersWithFollowers = createdUsers.map((user) => {
      const otherUsers = createdUsers.filter((u) => u._id !== user._id)
      const numFollowers = random.getRandomIntInclusive(1, 5)
      const randomFollowers = random.elements(otherUsers, numFollowers).map((e) => e._id)
      return { id: user._id, followers: randomFollowers }
    })
    usersWithFollowers.forEach(async (user) => {
      user.followers.forEach(async (follower) => {
        // console.log(`${user.id}`.blue.inverse, `${follower}`.yellow.inverse)
        await Promise.all([
          User.findByIdAndUpdate(follower, { $addToSet: { following: user.id } }, { new: true }),
          User.findByIdAndUpdate(user.id, { $addToSet: { followers: follower } }, { new: true }),
        ])
      })
    })

    //Assign random user to opinions
    const opinionsWithUser = opinions.map((opinion) => {
      const user = random.element(createdUsers)._id
      return { ...opinion, user }
    })

    // Assign random user and opinions to recipes
    const recipesWithUser = recipes.map((recipe) => {
      const author = random.element(createdUsers)._id
      const numOpinions = random.getRandomIntInclusive(1, 10)
      const randomOpinions = random.elements(opinionsWithUser, numOpinions)
      const rating = randomOpinions.reduce((acc, opinion) => acc + opinion.rating, 0) / randomOpinions.length
      return { ...recipe, author, opinions: randomOpinions, rating }
    })

    // Create recipes
    const createdRecipes = await Recipe.create(recipesWithUser)

    // Assign recipes to authors
    createdRecipes.forEach(async (recipe) => {
      const author = recipe.author
      await User.findByIdAndUpdate(author, { $addToSet: { recipes: recipe } }, { new: true })
    })

    // Assign random favorite recipes
    createdUsers.forEach(async (user) => {
      const numFavRecipes = random.getRandomIntInclusive(1, 10)
      const favRecipes = random.elements(createdRecipes, numFavRecipes).map((r) => r._id)
      await User.findByIdAndUpdate(user._id, { favRecipes }, { new: true })
    })

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
