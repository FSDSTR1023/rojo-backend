const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

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
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: 'User not found' })
      }
      if (!password || user.password !== password) {
        return res.status(403).json({ msg: 'Incorrect Password' })
      }

      const token = jwt.sign({ userName: user.userName, country: user.country }, process.env.JWT_KEY)
      res
        .cookie('token', token, {
          httpOnly: true,
        })
        .json({ msg: 'User logged in' })
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
