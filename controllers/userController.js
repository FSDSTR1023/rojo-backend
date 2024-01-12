const User = require('../models/user.model')
const Recipe = require('../models/recipe.model')

async function createUser(req, res) {
  User.create(req.body)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function getAllUsers(req, res) {
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
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function loginUser(req, res) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: 'User not found' })
      }
      if (!req.body.password || user.password !== req.body.password) {
        return res.status(403).json({ msg: 'Incorrect Password' })
      }
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

async function updateUser(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((recipes) => {
      res.status(200).json(recipes)
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

async function followUser(req, res) {
  const { followerUser, followedUser } = req.body

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

async function addFavoriteRecipe(req, res) {
  const { userId, recipeId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favRecipes: recipeId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function removeFavoriteRecipe(req, res) {
  const { userId, recipeId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favRecipes: recipeId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = { getAllUsers, createUser, getUserById, loginUser, updateUser, deleteUser, followUser, addFavoriteRecipe, removeFavoriteRecipe }
