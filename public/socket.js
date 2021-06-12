function initSocket() {

	Socket = io(LOCAL_URL);
	Socket.on('mouse', handleMouse);

}
function handleMouse(data) {
	let [x, y] = [data.x, data.y];
	console.log('got mouse:',x,y);
}

//#region code rest

function connectionHandlers() {
	Socket.on('clientId', handleClientIdSendLogin);
	Socket.on('db', handleDB);
	Socket.on('userJoined', handleUserJoined);
	Socket.on('userLeft', handleUserLeft);
	Socket.on('userMessage', handleUserMessage);

	Socket.on('gameState', handleGameState);
	Socket.on('dbUpdate', handleDbUpdate);

	Socket.on('mouse', handleMouse);
	Socket.on('show', handleShow);
	Socket.on('hide', handleHide);

	//debugging:
	Socket.on('lastState', handleLastState);

	//Socket.on('initialPool', handleInitialPool); //skip for now!


	// Socket.on('gameOver', handleGameOver);
	// Socket.on('gameCode', handleGameCode);
	// Socket.on('unknownCode', handleUnknownCode);
	// Socket.on('tooManyPlayers', handleTooManyPlayers);
}

function handleUserJoined(data) {
	logClientReceive('userJoined', data.username)
}
function handleUserLeft(data) {
	logClientReceive('userLeft', data.id)
}
function handleUserMessage(data) {
	logClientReceive('userMessage', data.username)
}

//sending
function sendLogin(username) { logClientSend('login', username); Socket.emit('login', { data: username }); }
function sendReset(settings) { logClientSend('reset', Username); Socket.emit('reset', { settings: settings, username: Username }); }
function sendUserMessage(data) { logClientSend('userMessage', data.username); Socket.emit('userMessage', { data: data }); }

//helpers: keeping track of messages!
function logClientSend(type, data) {
	MessageCounter++;
	if (VerboseSocket) console.log('#' + MessageCounter, 'send', type, data)
}
function logClientReceive(type, data) {
	MessageCounter++;
	if (VerboseSocket) console.log('#' + MessageCounter, 'receive', type, data)
}
//#endregion


