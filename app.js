const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require('./config/db')
const cookieParser = require('cookie-parser')

const testMiddleware = require('./middlewares/test.middleware')
const recipeRoutes = require('./routes/recipe.routes')
const { filters } = require('./middlewares/recipe.middleware')
const userRoutes = require('./routes/user.routes')
const { auth } = require('./middlewares/auth.middleware')

//Config
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(cookieParser())

// Connect to DB
if (!!process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
  db()
}

// Middlewares
app.use(testMiddleware.logginCallRoute)

//Routes
app.use('/recipe', auth, filters, recipeRoutes)
app.use('/user', userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
