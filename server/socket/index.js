import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import UserModel from '../models/User.model.js';
import { ConversationModel, MessageModel } from '../models/Conversation.model.js'
import getConversation from '../utils/getConversation.js';

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

  socket.on('message-page', async (userId) => {
    const userDetails = await UserModel.findById(userId).select('-password');
    const payload = {
      name: userDetails?.name,
      email: userDetails?.email,
      _id: userDetails?._id,
      online: onlineUser?.has(userId),
      profileImage: userDetails?.profileImage,
    }
    socket.emit('message-user', payload);


    /* get previous messages */
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ]
    }).populate('messages').sort({ updatedAt: -1 });

    socket.emit('message', getConversationMessage?.messages || []);

  })


  /* new messages */

  socket.on('new message', async (data) => {
    /* check conversation is available to both users */
    const conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ]
    })
    /* if conversation is not available */
    if (!conversation) {
      const createdConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      })
      await createdConversation.save();
    }
    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      messageByUserId: data?.messageByUserId,
    })
    const savedMessage = await message.save();


    const updatedConversation = await ConversationModel.updateOne(
      { _id: conversation?._id }, { "$push": { messages: savedMessage?._id } })
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ]
    }).populate('messages').sort({ updatedAt: -1 });

    io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
    io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

    const senderConversation = await getConversation(data?.sender);
    const receiverConversation = await getConversation(data?.receiver);

    io.to(data?.sender).emit('conversation', senderConversation);
    io.to(data?.receiver).emit('conversation', receiverConversation);
  })


  /* sidebar */

  socket.on('sidebar', async (currentUserId) => {
    const conversation = await getConversation(currentUserId);
    socket.emit('conversation', conversation);
  })

  socket.on('seen', async (messageByUserId) => {
    const conversation = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: messageByUserId },
        { sender: messageByUserId, receiver: user?._id },
      ]
    })
    const conversationMessageId = conversation?.messages || []
    const updateMessages = await MessageModel.updateMany({ _id: { "$in": conversationMessageId }, messageByUserId: messageByUserId }, {
      "$set": { seen: true }
    })

    const senderConversation = await getConversation(user?._id?.toString());
    const receiverConversation = await getConversation(messageByUserId);

    io.to(user?._id?.toString()).emit('conversation', senderConversation);
    io.to(messageByUserId).emit('conversation', receiverConversation);
  })


  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUser.delete(user?._id.toString());
  });
});

export {
  app,
  server,
};
