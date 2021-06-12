const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const path = require('path');
const fs = require('fs');
const base = require('./public/base.js');
const { REMOTE_PORT, BACKEND_PATH } = require('./public/globals.js');

// const REMOTE_URL = `http://localhost:${REMOTE_PORT}/`;
const REMOTE_URL = 'https://glasperlenserver.herokuapp.com/';

var io = require('socket.io-client');
var socket = io.connect(REMOTE_URL, {
	reconnection: true
});

socket.on('connect', function () {
	console.log(`connected to ${REMOTE_URL}`);
	socket.on('message', function (data) {
		console.log('message from the server:', data);
		socket.emit('serverEvent', "thanks server! for sending '" + data.data + "'");
	});
});

// setInterval(function () {
//     client.emit('clientEvent', Math.random());
//     console.log('message sent to the clients');
// }, 3000);

socket.emit('message', { data: 'test message' });






