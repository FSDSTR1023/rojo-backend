const User = require('../models/user.model');

async function createUser(req, res) {
  User.create(req.body)
    .then((user) => {
      console.log('user created', user);
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err, ' <---- error try again something went wrong');
      res.status(400).json(err);
    });
}

async function getAllUsers(req, res) {
  User.find()
    .then((users) => {
      console.log('users found', users);
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err, ' <---- error try again something went wrong');
      res.status(400).json(err);
    });
}

module.exports = { getAllUsers, createUser };