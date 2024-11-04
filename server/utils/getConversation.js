import { ConversationModel } from "../models/Conversation.model.js";

const getConversation = async (currentUserId) => {
  try {
    const currentUserConversation = await ConversationModel.find({
      '$or': [
        { sender: currentUserId },
        { receiver: currentUserId },
      ]
    }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver');
    const payload = currentUserConversation.map((conversation) => {
      const countUnseenMessages = conversation.messages.reduce(
        (prev, current) => {
          const messageByUserId = current?.messageByUserId.toString()
          if (messageByUserId !== currentUserId) {
            return prev + (current.seen ? 0 : 1)
          }
          else{
return prev
          }
        }, 0
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

    return payload;
  } catch (error) {
    console.log(error.message);
  }
}
export default getConversation;