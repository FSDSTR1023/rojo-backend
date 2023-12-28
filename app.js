const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require('./config/db')

const recipeRoutes = require('./routes/recipe.routes')
const recipeMiddleware = require('./middlewares/recipe.middleware')
const userRoutes = require('./routes/user.routes')

//Config
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

// Connect to DB
db()

//Routes
app.use('/recipe', recipeMiddleware.filters, recipeRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  console.log(process.env.DB_USER)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
