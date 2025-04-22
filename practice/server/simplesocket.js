const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Message from client
  socket.on('message', (msg) => {
    console.log(`📩 Received message from ${socket.id}: ${msg}`);
    socket.emit('message', `Echo: ${msg}`); // send back to sender
  });

  // Broadcast message to all except sender
  socket.on('broadcast', (msg) => {
    socket.broadcast.emit('broadcast', `📣 Broadcast from ${socket.id}: ${msg}`);
  });

  // Join room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    socket.emit('message', `Joined room: ${roomName}`);
    console.log(`${socket.id} joined room: ${roomName}`);
  });

  // Send to room
  socket.on('sendToRoom', ({ roomName, msg }) => {
    io.to(roomName).emit('roomMessage', `Room ${roomName} - ${socket.id}: ${msg}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = 7000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
