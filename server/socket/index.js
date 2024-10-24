import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserModel from '../models/User.model.js';

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST"] // HTTP methods allowed
  }
});

/* online user */
const onlineUser = new Set()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  /* current user */
  const user = socket.handshake.auth.user;
  console.log('Authenticated user:', user);
  /* create a room */
  console.log(user?._id);
  socket.join(user?._id.toString())
  onlineUser.add(user?._id?.toString())
  io.emit("onlineUser", Array.from(onlineUser))

  socket.on('message', async (userId) => {
    const userDetails = await UserModel.findById(userId).select('-password');
    const payload = {
      name: userDetails.name,
      email: userDetails.email,
      _id: userDetails._id,
      online: onlineUser.has(userId),
      profileImage: userDetails.profileImage,
    }
    socket.emit('message-user', payload);

  })

  // Handle disconnection
  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
  });
});

export {
  app,
  server,
};
