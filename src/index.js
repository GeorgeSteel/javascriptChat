const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio.listen(server);
const path = require('path');
const mongoose = require('mongoose');

//db connection
mongoose.connect('mongodb://localhost/chat-database', { useNewUrlParser: true })
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

//settings
app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

//sending static files
app.use(express.static(path.join(__dirname, 'public')));

// start server
server.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});