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
    const dictionary = {
	    'привет': 'И тебе привет!',
	    'ты кто?': 'Я бот Валерий. И я живу в этом чате.',
	    'как дела?': 'Хорошо, а у тебя как?',
	    'что ты умеешь?': 'Отвечать на некоторые сообщения. И больше ни на что, увы, не способен :)',
	    '123': '456',
	    '789': 'Ну я так много цифр не знаю.'
	}
	socket.on('chat message', (msg, nick) => {
	    nick = socket.nickname;
	    io.emit('chat message', msg , nick);
	    const msgTrimAndLowerCase = dictionary[msg.trim().toLowerCase()];
	    if (msgTrimAndLowerCase) {
	    	io.emit('chat message', msgTrimAndLowerCase , 'бот Валерий');
	  	}
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
		if (!socket.nickname) return;
		nicknames.splice(nicknames,indexOf(socket.nickname), 1);
		io.sockets.emit('usernames', nicknames);
	});
});