const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const path = require('path');
const fs = require('fs');
const base = require('./public/base.js');
const { LISTEN_AT_PORT, REMOTE_URL, REMOTE_PORT, BACKEND_PATH } = require('./public/globals.js');

var ioOutbound = require('socket.io-client');
var outSocket = ioOutbound.connect(REMOTE_URL, {
	reconnection: true
});

outSocket.on('connect', function () {
	console.log(`connected to ${REMOTE_URL}`);
	outSocket.on('message', function (data) {
		console.log('message from the server:', data);
		outSocket.emit('serverEvent', "thanks server! for sending '" + data.data + "'");
	});
});

const io = require('socket.io')(http); //, { cors: { origins: ['http://localhost:' + PORT] } });
io.on('connection', client => {

	//connection and login: userManager
	userman.handleConnectionSendClientId(client); //just sends back client id to client: userManager
	client.on('login', x => userman.handleLoginSendDB(client, x)); //returns DB to client, broadcast entered lobby: userManager
	client.on('disconnect', x => { simple.handlePlayerLeft(client, x); userman.handleDisconnected(client, x); }); //broadcast user left: userManager
	client.on('userMessage', x => userman.handleUserMessage(client, x)); //broadcast user left: userManager

	client.on('mouse', x => { io.emit('mouse', x); });//should send x,y,username
	client.on('show', x => { io.emit('show', x); });//should send x,y,username
	client.on('hide', x => { io.emit('hide', x); });//should send x,y,username
});

// setInterval(function () {
//     client.emit('clientEvent', Math.random());
//     console.log('message sent to the clients');
// }, 3000);

outSocket.emit('message', { data: 'test message' });

http.listen(LISTEN_AT_PORT, () => { console.log('listening on port ' + LISTEN_AT_PORT); });






