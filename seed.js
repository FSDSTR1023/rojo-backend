const dotenv = require('dotenv')
const fs = require('fs')
const colors = require('colors')
const db = require('./config/db')

//Load models
const Recipe = require('./models/recipe.model')

//Connect to db
db().then()

// Read the JSON files
const recipes = JSON.parse(fs.readFileSync('./data/recipe.data.json', 'utf-8'))

// Import sample data in DB
const importData = async () => {
  try {
    await Recipe.create(recipes)
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
