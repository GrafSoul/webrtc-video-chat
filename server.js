const express = require('express'); // Added express server
const http = require('http'); // Added HTTP-server
const socket = require('socket.io'); // Added Socket.io
const port = 8000;

const app = express(); // Created an instance of Express

const server = http.createServer(app); // Created a server instance

const io = socket(server); // Connected sockets to the server

// Socket functionality
const rooms = {};

io.on('connection', (socket) => {
    socket.on('join room', (roomID) => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }

        const otherUser = rooms[roomID].find((id) => id !== socket.id);

        if (otherUser) {
            socket.emit('other user', otherUser);
            socket.to(otherUser).emit('user joined', socket.id);
        }
    });

    socket.on('offer', (payload) => {
        io.to(payload.target).emit('offer', payload);
    });

    socket.on('answer', (payload) => {
        io.to(payload.target).emit('answer', payload);
    });

    socket.on('ice-candidate', (incoming) => {
        io.to(incoming.target).emit('ice-candidate', incoming.candidate);
    });
});

// Started the server
server.listen(port, () => {
    console.log(`**************************************`);
    console.log(`Server is running on port: ${port}`);
    console.log(`URL address: http://localhost:${port}`);
    console.log(`**************************************`);
});
