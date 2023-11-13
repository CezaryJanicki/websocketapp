const express = require('express');
const socket = require('socket.io');
const path = require('path');
const app = express();


const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, './client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});
app.use((req, res) => {
    return res.json({
        message: 'Not found...'
    });
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);
io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    let userName = '';
    io.emit('users', { users });

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('newMember', ({ user }) => {
    users.push({ name: user, id: socket.id });
    io.emit('users', { users });
    userName = user;
    socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `${userName} has joined a room`,
        });
    });

    socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');

    users = users.filter(user => user.id !== socket.id);

    io.emit('users', { users });

    socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `${userName} has left the conversation... :(`,
        });
    });
});

