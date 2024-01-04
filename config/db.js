require('dotenv').config()

const mongoose = require('mongoose')

const mongoDB =
  'mongodb+srv://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PASSWORD +
  '@' +
  process.env.DB_SERVER +
  '/' +
  process.env.DB_NAME +
  '?retryWrites=true&w=majority'

async function db() {
  try {
    await mongoose.connect(mongoDB)
  } catch (err) {
    console.log(err)
  }
}

module.exports = db
