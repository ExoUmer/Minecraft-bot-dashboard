const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createBot, destroyBot } = require('./bot/bot2');
const server = createServer(app);
const io = new Server(server);

let connectedUsers = 0;
let botCreated = false;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    connectedUsers++;
    console.log('User connected. Total:', connectedUsers);

    if (!botCreated) {
        createBot(socket);
        botCreated = true;
    }

    socket.on('disconnect', () => {
        connectedUsers--;
        console.log('User disconnected. Remaining:', connectedUsers);

        // if (connectedUsers === 0) {
        //     destroyBot();
        //     botCreated = false;
        // }
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
