const Verbose = true;
const HEROKU = false;

//#region require & const
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const path = require('path');
const fs = require('fs');
const base = require('./public/base.js');
const { LISTEN_AT_PORT } = require('./public/globals.js');
const PERLENPATH = './public/PERLENDATA/';
const REMOTE_PORT = 3001;
const REMOTE_URL = HEROKU ? 'https://glasperlenserver.herokuapp.com/' : 'http://localhost:' + REMOTE_PORT + '/';
//#endregion

//#region socket to remote url (3001 | heroku)
var ioOutbound = require('socket.io-client');
var outSocket = ioOutbound.connect(REMOTE_URL, {
	reconnection: true
});

outSocket.on('connect', function () {
	log('event:', `connected to ${REMOTE_URL}`);

	outSocket.on('ack', x => {
		log('got ack', x);
		ioInbound.emit('status',{msg:'...remote server ok'});
	});

});
//#endregion



//#region socket to local url (3333)
const ioInbound = require('socket.io')(http, { cors: { origins: ['http://localhost:' + LISTEN_AT_PORT] } });

//client is only browser windows on same machine!
ioInbound.on('connection', client => {

	log('inbound connection!',client.id);
	client.emit('mouse',{x:12,y:123})
	// ioInbound.emit('newClient', { data: `${client.id} has connected!` });
	// outSocket.emit('newClient', { data: `${client.id} has connected!` });

	client.on('mouse', x => { ioInbound.emit('mouse', x); });//should send x,y,username
});
//#endregion

http.listen(LISTEN_AT_PORT, () => { console.log('listening on port ' + LISTEN_AT_PORT); });

//#region helpers and testing
var MessageCounter = 0;
var TO; //timeout or interval
function log() {
	MessageCounter += 1;
	if (Verbose) console.log('#' + MessageCounter + ':', ...arguments);
}
function outSocketPingTest() {
	TO = setInterval(function () {
		outSocket.emit('ping', { data: 'test message' }); //test message!
	}, 3000);
	setTimeout(() => clearInterval(TO), 10000);
}

//#endregion


