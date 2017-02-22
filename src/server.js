const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

const app = express()
app.use('/static', express.static(path.join(__dirname, './public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'))
})

const server = http.createServer(app)

const io = socketio.listen(server)
io.sockets.on('connection', socket => {
  socket.on('drawing', data => {
    let last = socket.lastPoint || data

    io.sockets.emit('draw', {
      last,
      new: {
        x: data.x,
        y: data.y
      },
      color: data.color
    })

    socket.lastPoint = {
      x: data.x,
      y: data.y
    }
  })

  socket.on('stopdrawing', _ => {
    delete socket.lastPoint
  })
})

server.listen(3000)
