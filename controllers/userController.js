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
        const token = jwt.sign(
          { userName: user.userName, country: user.country, authorization: 'user' },
          process.env.JWT_KEY,
        )

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

module.exports = { getAllUsers, createUser, getUserById, loginUser, updateUser, deleteUser }
