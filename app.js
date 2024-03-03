const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require('./config/db')
const configureSocketServer = require('./config/socket')
const cookieParser = require('cookie-parser')

const testMiddleware = require('./middlewares/test.middleware')
const recipeRoutes = require('./routes/recipe.routes')
const { filters } = require('./middlewares/recipe.middleware')
const userRoutes = require('./routes/user.routes')

const { auth } = require('./middlewares/auth.middleware')

// Configuración
app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://health-app-nuclio.netlify.app'],
    credentials: true,
  }),
)
app.use(cookieParser())

// Conexión a la base de datos
if (!!process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
  db()
}

// Middlewares
app.use(testMiddleware.logginCallRoute)

// Rutas
app.use('/recipe', filters, recipeRoutes)
app.use('/user', userRoutes)

// Socket.IO
const socketServer = configureSocketServer()

socketServer.listen(4000, () => {
  console.log(`Socket.IO escuchando en el puerto 4000`)
})

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`)
})

module.exports = app
