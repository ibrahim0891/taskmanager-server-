const mongoose = require("mongoose");

const messageModel = new mongoose.Schema(
  {
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = messageModel;
