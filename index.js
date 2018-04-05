const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const nicknames = [];

app.use('/static',express.static('src/'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

http.listen(3000, () => {
  console.log('listening on: 3000');
});

io.on('connection', (socket) => {
  console.log('user connected '+ socket.id);

  socket.on('new user', (data, callback) => {
  	if (nicknames.indexOf(data) != -1) {
  		callback(false);
  	} else {
  		callback(true);
  		socket.nickname = data;
  		nicknames.push(socket.nickname);
  		io.sockets.emit('usernames', nicknames);
  	}
  });

  socket.on('chat message', (msg, nick) => {
  	nick = socket.nickname;
    io.emit('chat message', msg , nick);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (!socket.nickname) return;
    nicknames.splice(nicknames,indexOf(socket.nickname), 1);
    io.sockets.emit('usernames', nicknames);
  });
});