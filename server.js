const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

//Get our Api Routes
const api = require('./server/routes/api');
const serverApi = require('./server/routes/server-api');

//Db
var mongoose = require('mongoose');
const db = require('./config/db');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
app.use('/server-api', serverApi);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Socket.io real time data
*/
const io = socketIO(server);
io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});

	socket.on('update', (civ) => {
		console.log("Draft Update");
		io.emit('update', civ);
	});
});
/**
 * Listen on provided port, on all network interfaces.
 */
mongoose.connect(db.url, (err) => {
	if(err) return console.log(err);

	server.listen(port, () => console.log(`API running on localhost:${port}`));
});
