


const express = require("express");
const MessageRouter = express.Router();
const { createChat, sendMessageToPublicRoom, leaveChat, loadAllChat, getAllPublicRoom, joinPublicRoom, getChatMessages  , getChatInfo} = require("../../controller/message/MessageController");

MessageRouter.post("/createChat", createChat);
MessageRouter.post("/sendMessageToPublicRoom", sendMessageToPublicRoom);
MessageRouter.post("/leaveChat", leaveChat);
MessageRouter.get("/getChats", loadAllChat);
MessageRouter.get("/getAllPublicChats", getAllPublicRoom);
MessageRouter.post("/joinPublicChat", joinPublicRoom);
MessageRouter.get("/getChatMessages", getChatMessages);
MessageRouter.get('/getChatInfo' , getChatInfo)
module.exports = MessageRouter;