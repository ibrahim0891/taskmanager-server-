const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: false,
        },
        chats: [
            {
                type: mongoose.Schema.Types.ObjectId ,
                ref : "Chat" 
            }
        ],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        pendingFR: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        sentFR: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
module.exports = User;
