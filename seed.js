const db = require('./config/db')
const colors = require('colors')
const deleteData = require('./mocks/DeleteData.js')
const importData = require('./mocks/ImportData.js')

//Connect to db
db().then()

// Import sample data in DB
const importDataDB = async () => {
  try {
    await importData()
    console.log(`Data successfully imported`.green.inverse)
  } catch (err) {
    console.log(err)
  } finally {
    process.exit()
  }
}

// Delete the data from DB
const deleteDataDB = async () => {
  try {
    await deleteData()
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
    importDataDB().then()
    break
  case '-d':
    deleteDataDB().then()
    break
  default:
    console.log(`Wrong parameter assigned`.yellow.inverse)
    process.exit()
}
