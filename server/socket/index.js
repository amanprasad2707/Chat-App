import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserModel from '../models/User.model.js';
import { ConversationModel, MessageModel } from '../models/Conversation.model.js'

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
  /* current user */
  const user = socket.handshake.auth.user;
  /* create a room */
  socket.join(user?._id?.toString())
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
    /* get previous messages */
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id },
      ]
    }).populate('messages').sort({ updatedAt: -1 });

    socket.emit('previous messages', getConversationMessage)

  })


  socket.on('new message', async (data) => {
    /* check conversation is available to both users */
    const conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ]
    })
    /* if conversation is not available */
    if (!conversation) {
      const createdConversation = await ConversationModel({
        sender: data.sender,
        receiver: data.receiver,
      })
      await createdConversation.save();
    }
    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      messageByUserId: data?.messageBy,
    })
    const savedMessage = await message.save();
    const updatedConversation = await ConversationModel.updateOne(
      { _id: conversation?._id }, { "$push": { messages: savedMessage?._id } })
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ]
    }).populate('messages').sort({ updatedAt: -1 });

    io.to(data.sender).emit('message', getConversationMessage?.messages || []);
    io.to(data.receiver).emit('message', getConversationMessage?.messages || []);
  })


  socket.on('sidebar', async (currentUserId) => {
    // console.log("currentUserId", currentUserId)
    try {
      const currentUserConversation = await ConversationModel.find({
        '$or': [
          { sender: currentUserId },
          { receiver: currentUserId },
        ]
      }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver');
      const payload = currentUserConversation.map((conversation) => {
        const countUnseenMessages = conversation.messages.reduce(
          (prev, current) => prev + (current.seen ? 0 : 1), 0
        );
      
        // Return an object for each conversation
        return {
          _id: conversation?._id,
          sender: conversation?.sender,
          receiver: conversation?.receiver,
          unseenMessages: countUnseenMessages,
          lastMessage: conversation?.messages[conversation?.messages.length - 1],
        };
      });
      
socket.emit('conversation', payload);
    } catch (error) {
  console.log(error.message);
}
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
