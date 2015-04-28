var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = {};
server.listen(3000);


app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('sendmessage', function(data, callback) {
		var msg = data.trim();
		console.log("msg",msg);
		console.log("dhhhskdhfkhs", msg.substr(0,3));
		if(msg.substr(0,3) === '/w')
		{
			msg = msg.substr(3);
			console.log("msg2333",msg);
			var ind = msg.indexOf(' ');
			if(ind !== -1)
			{
				var name = msg.substr(0,ind);
				var msg = msg.substr(ind+1);
				if(name in users)
				{
					users[name].emit('whisper', {msg: msg, nick: socket.nickname});
					console.log("whisper");
				}
				else
				{
					callback('Error:enter a valid user');
				}	
			}
			else
			{
				callback('Error: no msg');
			}	
		}
		else
		{

		}
		io.sockets.emit('newmessage', {msg: msg, nick: socket.nickname});
	});
	
	socket.on('new user', function(data, callback) {
		if(data in users) {
			callback(false);
		}
		else {
			callback(true);
			socket.nickname = data;
			users[socket.nickname] = socket;
			updateNickname();
		}
	});

	function updateNickname(){
		io.sockets.emit('usernames', Object.keys(users));
	} 
	socket.on('disconnect', function(data) {
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updateNickname();
	})
});