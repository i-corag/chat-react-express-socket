require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // necessary to build the express server together with socket.io
const { Server } = require('socket.io');

//create express app
const app = express();

//middleware
app.use(cors());

//create server from express app
const server = http.createServer(app);

//instance of the Server class from socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    //methods: ['GET', 'POST'],
  },
});

//initiate and detect if someone is connected to this socket io server
io.on('connection', (socket) => {
  console.log(`The user Ivana ${socket.id} is connected`);

  //to detect if someone wants to join a room
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`user with id ${socket.id} join room ${data}`);
  });

  //to get the messages
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  //to disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });
});

//server listening
const PORT = process.env.PORT || 5955;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
