const socket = io.connect('//localhost:3000')
const canvas = document.querySelector('#dashboard')
const board = canvas.getContext('2d')
const colorButtons = document.querySelectorAll('.colors')

// Settings
let lineColor = '#2c3e50'

board.lineJoin = 'round'
board.lineCap = 'round'
board.lineWidth = 2

// Selection couleur
for (let button of colorButtons) {
  button.addEventListener('click', (e) => {
    e.preventDefault()

    for (let button of colorButtons) {
      button.classList.remove('active')
    }

    e.target.classList.add('active')
  })
}

// Detection action utilisateur
function onmousemove (e) {
  socket.emit('drawing', { color: lineColor, x: e.offsetX, y: e.offsetY })
}

canvas.addEventListener('mousedown', e => {
  let selectedButton = document.querySelector('.colors.active')
  if (selectedButton !== null) {
    lineColor = selectedButton.dataset.color
  }

  canvas.addEventListener('mousemove', onmousemove)
})

canvas.addEventListener('mouseup', e => {
  socket.emit('stopdrawing')
  canvas.removeEventListener('mousemove', onmousemove)
})

// dessin
socket.on('draw', data => {
  board.strokeStyle = data.color
  board.beginPath()
  board.moveTo(data.last.x, data.last.y)
  board.lineTo(data.new.x, data.new.y)
  board.stroke()
})
