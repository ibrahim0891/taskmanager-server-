const FriendRoute = require("express").Router();

const {
  getUsers,
  addFriends,
  deleteFriend,
  acceptReq,
  cancelReq,
} = require("../controller/FriendController");

FriendRoute.get("/", getUsers);
FriendRoute.post("/:id", addFriends);
FriendRoute.post("/:id", deleteFriend);
FriendRoute.post("/:id", acceptReq);
FriendRoute.post("/:id", cancelReq);

module.exports = FriendRoute;
