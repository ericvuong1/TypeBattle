const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const TypeBattleGame = require('./typebattle-game');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;
let game = null;

io.on('connection', (sock) => {

    if (waitingPlayer) {
      game = new TypeBattleGame(waitingPlayer, sock);
      let currentState = game.currentState;
      console.log(currentState)

      sock.emit('info', 'Player2');
      sock.emit('state', currentState)
      waitingPlayer.emit('state', currentState);
      waitingPlayer = null;
    } else {
      console.log('Waiting for game');
      waitingPlayer = sock;
      waitingPlayer.emit('message', 'Waiting for an opponent');
      waitingPlayer.emit('info', 'Player1');
    }

  sock.on('message', (text) => {
    io.emit('message', text);
  });

  sock.on('update', (text) => {
    game && game.update(text);
  })
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('TypeBattle started on 8080');
});