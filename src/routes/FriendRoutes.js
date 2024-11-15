const FriendRoute = require("express").Router();

const {
  getUser,
  addFriends,
  deleteFriend,
} = require("../controller/FriendController");
