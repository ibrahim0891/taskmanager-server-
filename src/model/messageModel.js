const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true }, // Link to the Chat
    text: { type: String, required: true },
    media: { type: String },   
    timestamp: { type: Date, default: Date.now },
    messageType: { type: String, enum: ["text", "media"], default: "text" }, // Type of the message
});


const chatSchema = new mongoose.Schema({
    name: { type: String, required: true },  // For group chats, chatroom name
    type: { type: String, enum: ["public", "group", "private"], required: true }, // Type of the chat
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // List of participants (users) in the chat
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Creator of the group chat or public room
});

const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {Chat , Message}