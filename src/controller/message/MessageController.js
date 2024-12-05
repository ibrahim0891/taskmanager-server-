const { Chat, Message } = require("../../model/messageModel");
const User = require("../../model/userModel");


const messageController = {}


messageController.createChat = async (req, res) => {
    const senderId = req.headers.uid
    const receiverId = req.body.uid

    console.log(senderId, receiverId);

    // Check if chat already exists between users
    if (!senderId || !receiverId) {
        res.status(400).send({ message: 'error' })
        return
    }
    const existingChat = await Chat.findOne({
        members: { $all: [senderId, receiverId] }
    })

    if (existingChat) {
        return res.status(200).json(existingChat._id)
    }

    const newChat = new Chat({
        createdBy: senderId,
        members: [senderId, receiverId]
    })

    await newChat.save()
        .then(chat => {
            return Promise.all([
                User.findByIdAndUpdate(senderId, { $push: { chats: chat._id } }),
                User.findByIdAndUpdate(receiverId, { $push: { chats: chat._id } })
            ])
        })
        .then(() => { 
            res.send(newChat._id)
        })
        .catch(err => {
            res.status(500).json({ error: err.message })
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

messageController.loadAllChat = async (req, res) => {
    const userId = req.headers.uid;
    const chats = await User.findOne({ _id: userId }).select({ chats: 1 }).populate({
        path: 'chats',
        populate: [{
            path: 'createdBy',
            select: 'name'
        },
        {
            path: 'members',
            select: 'name'
        }]
    })
    res.json(chats)
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
    const chatId = req.headers['chatid'];

    if (!chatId) {
        return res.status(400).json({ error: "Chat ID is required in the headers" });
    }

    console.log(`Fetching messages for chatId: ${chatId}`);

    Message.find({ chatId }).populate('sender', 'name email')        .then((messages) => {
            res.status(200).json(messages);
        })
        .catch((err) => {
            console.error(`Error fetching messages for chatId ${chatId}: ${err.message}`);
            res.status(500).json({ error: err.message });
        });
};

messageController.getChatInfo = async (req, res) => {
    const chatID = req.headers.chatid; // Headers are case-insensitive, prefer lowercase

    if (!chatID) {
        return res.status(400).json({ error: "Chat ID is required in the headers" });
    }

    try {
        console.log(`Fetching chat info for chatID: ${chatID}`);
        const chat = await Chat.findById(chatID).populate('members', 'name email'); // Correct method is `findById`

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error(`Error fetching chat info for chatID ${chatID}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = messageController;