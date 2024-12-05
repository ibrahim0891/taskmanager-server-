const { Chat, Message } = require("../../model/messageModel");


const messageController = {}


messageController.createChat = (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const participants = req.body.participants;
    const createdBy = req.body.createdBy;
    const createdAt = new Date();

    const newChat = new Chat({
        name,
        type,
        participants,
        createdBy,
        createdAt,
    });
    newChat.save().then((chat) => {
        res.status(201).json(chat);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    })
}

messageController.sendMessageToPublicRoom = (req, res) => {
    const sender = req.body.sender;
    const chatId = req.body.chatId;
    const text = req.body.text;
    const media = req.body.media;
    const messageType = req.body.messageType;
    const timestamp = new Date();
    const newMessage = new Message({
        sender,
        chatId,
        text,
        media,
        messageType,
        timestamp,
    });
    newMessage.save().then((message) => {
        res.status(201).json(message);
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    })
}

messageController.leaveChat = (req, res) => {
    const chatId = req.body.chatId;
    const userId = req.body.userId;
    Chat.findByIdAndUpdate(chatId, { $pull: { participants: userId } }, { new: true })
        .then((chat) => {
            if (!chat) {
                return res.status(404).json({ error: "Chat not found" });
            }
            res.status(200).json(chat);
        })
}

messageController.loadAllChat = (req, res) => {
    const userId = req.headers.uid;
    Chat.find({ participants: userId })
        .populate("participants", "name").then((chats) => {
            res.status(200).send(chats);
        })
        .catch((err) => {
            res.status(500).send({ error: err.message });
        })
}
messageController.getAllPublicRoom = (req, res) => {
    Chat.find({ type: "public" }).then((chats) => {
        res.status(200).json(chats);
    })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        })
}
messageController.joinPublicRoom = (req, res) => {
    const userId = req.body.userId;
    const roomId = req.body.roomId;
    Chat.findByIdAndUpdate(roomId, { $push: { participants: userId } }, { new: true })
        .then((chat) => {
            if (!chat) {
                return res.status(404).json({ error: "Chat not found" });
            }
            res.status(200).json(chat);
        })
}

messageController.getChatMessages = (req, res) => {
    const chatId = req.headers.chatId;
    Message.find({ chatId }).then((messages) => {
        res.status(200).json(messages);
    })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        })
}




module.exports = messageController;