const { createServer } = require('http')
const { Server } = require('socket.io')

// Se crea una función para configurar y devolver el servidor de Socket.IO
function configureSocketServer() {
  const server = createServer()
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://health-app-nuclio.netlify.app'],
      credentials: true,
    },
  })

  const onlineUsers = []

  io.on('connection', (socket) => {
    socket.on('message', (data) => {
      socket.broadcast.emit('message', data)
    })

    socket.on('userConnection', (id, userName) => {
      onlineUsers.push(id)
      socket.broadcast.emit('userConnectionMsg', userName)
    })

    socket.on('userDisconnect', (id, userName) => {
      onlineUsers.filter((userId) => userId !== id)
      socket.broadcast.emit('userDisconnectMsg', userName)
    })
  })

  // Se devuelve el servidor de Socket.IO
  return server
}

module.exports = configureSocketServer
