const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function createUser(req, res) {
  const saltRounds = 10
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(400).json(err)
    }

    User.create({ ...req.body, password: hash })
      .then((user) => {
        res.status(200).json(user)
      })
      .catch((err) => {
        res.status(400).json(err)
      })
  })
}

async function getAllUsers(_req, res) {
  User.find()
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function getUserById(req, res) {
  User.findById(req.params.id)
    .populate({
      path: 'favRecipes',
      select: 'title imageUrl difficulty categories preparationTime',
    })
    .exec()
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function loginUser(req, res) {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      // Check if user exists in the DB
      if (!user) {
        return res.status(404).json({ msg: 'User not found' })
      }

      // Compare provided password with encrypted one from DB
      bcrypt.compare(password, user.password, (error, result) => {
        // Check if results
        if (error || !result) {
          return res.status(403).json({ msg: 'Incorrect Password', error })
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY)

        // Send response with cookie token
        res
          .cookie('token', token, {
            httpOnly: true,
          })
          .json({ msg: 'User logged in' })
      })
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function logoutUser(req, res) {
  try {
    res.clearCookie('token').send()
  } catch (err) {
    res.status(400).json(err)
  }
}

async function updateUser(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function deleteUser(req, res) {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function addFollower(req, res) {
  const followerUser = req.userId
  const followedUser = req.params.id

  if (followerUser === followedUser) {
    return res.status(400).json({ msg: 'A user cannot follow themself' })
  }

  Promise.all([
    User.findByIdAndUpdate(followerUser, { $addToSet: { following: followedUser } }, { new: true }),
    User.findByIdAndUpdate(followedUser, { $addToSet: { followers: followerUser } }, { new: true }),
  ])
    .then(([user1, user2]) => {
      const msg = `User ${user1.userName} is now following ${user2.userName}`
      res.status(200).json({ msg })
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function removeFollower(req, res) {
  const followerUser = req.userId
  const followedUser = req.params.id

  if (followerUser === followedUser) {
    return res.status(400).json({ msg: 'A user cannot follow themself' })
  }

  Promise.all([
    User.findByIdAndUpdate(followerUser, { $pull: { following: followedUser } }, { new: true }),
    User.findByIdAndUpdate(followedUser, { $pull: { followers: followerUser } }, { new: true }),
  ])
    .then(([user1, user2]) => {
      const msg = `User ${user1.userName} is now not following ${user2.userName}`
      res.status(200).json({ msg })
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function addFavoriteRecipe(req, res) {
  const userId = req.userId
  const recipeId = req.params.id

  try {
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { favRecipes: recipeId } }, { new: true })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(400).json(err)
  }
}

async function removeFavoriteRecipe(req, res) {
  const userId = req.userId
  const recipeId = req.params.id

  try {
    const user = await User.findByIdAndUpdate(userId, { $pull: { favRecipes: recipeId } }, { new: true })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(400).json(err)
  }
}

async function checkAuthToken(req, res) {
  const userId = req.userId
  if (userId) {
    User.findById(userId)
      .then((user) => {
        res.status(200).json(user)
      })
      .catch((err) => {
        res.status(400).json(err)
      })
  } else {
    res.status(400).json(err)
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  addFollower,
  removeFollower,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  checkAuthToken,
}
