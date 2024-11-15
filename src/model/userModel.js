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
    friends: {
      type: mongoose.schema.types.objectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
module.exports = User;
