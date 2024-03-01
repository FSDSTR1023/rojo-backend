const fs = require('fs')
const bcrypt = require('bcrypt')
const random = require('../utils/random.js')

//Load models
const Recipe = require('../models/recipe.model.js')
const User = require('../models/user.model.js')

const importData = async () => {
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
    return { ...recipe, author, opinions: randomOpinions }
  })

  // Create recipes
  await Recipe.create(recipesWithUser)
}

module.exports = { importData }
