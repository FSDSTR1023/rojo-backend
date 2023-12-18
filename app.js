const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

require('dotenv').config()

const mongoose = require('mongoose')

const mongoDB = //string que enviamos
  'mongodb+srv://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PASSWORD +
  '@' +
  process.env.DB_SERVER +
  '/' +
  process.env.DB_NAME +
  '?retryWrites=true&w=majority'
console.log(mongoDB, 'mongoDB')

async function main() {
  //funcion asincrona que enviamos con main que es una convencion
  await mongoose.connect(mongoDB)
}
main().catch((err) => console.log(err)) //le pasamos la funcion, y si hay un error se lo pasamos

const recipeRoutes = require('./routes/recipe.routes')
const userRoutes = require('./routes/user.routes')

app.use('/recipe', recipeRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  console.log(process.env.DB_USER)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
