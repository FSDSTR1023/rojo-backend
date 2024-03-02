const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require('./config/db')
const cookieParser = require('cookie-parser')
const { createServer } = require('http')
const { Server } = require('socket.io')

const testMiddleware = require('./middlewares/test.middleware')
const recipeRoutes = require('./routes/recipe.routes')
const { filters } = require('./middlewares/recipe.middleware')
const userRoutes = require('./routes/user.routes')

const { auth } = require('./middlewares/auth.middleware')
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})

//Config
app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://health-app-nuclio.netlify.app'],
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
app.use('/recipe', filters, recipeRoutes)
app.use('/user', userRoutes)

//Socket.Io

const onlineUsers = []

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data)
  })

  socket.on('userConnection', (id, userName) => {
    onlineUsers.push(id)
    socket.broadcast.emit('userConnectionMsg', userName)
    console.log(onlineUsers)
  })

  socket.on('userDisconnect', (id, userName) => {
    onlineUsers.filter((userId) => userId !== id)
    socket.broadcast.emit('userDisconnectMsg', userName)
    console.log(onlineUsers)
  })
})

server.listen(port, () => {
  console.log(`App y Socket.IO escuchando en el puerto ${port}`)
})

module.exports = app
