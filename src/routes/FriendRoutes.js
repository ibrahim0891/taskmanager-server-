const FriendRoute = require("express").Router();

const {
  getUsers,
  addFriends,
  deleteFriend,
} = require("../controller/FriendController");

FriendRoute.get("/", getUsers);
FriendRoute.post("/:id", addFriends);
FriendRoute.delete("/:id", deleteFriend);

module.exports = FriendRoute;
