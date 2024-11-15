const FriendRoute = require("express").Router();

const {
  getUsers,
  addFriends,
  deleteFriend,
  acceptReq,
  cancelReq,
} = require("../controller/FriendController");

FriendRoute.get("/", getUsers);
FriendRoute.post("/addFriend/:id", addFriends);
FriendRoute.post("/deleteFriend/:id", deleteFriend);
FriendRoute.post("/acceptReq/:id", acceptReq);
FriendRoute.post("/cancelReq/:id", cancelReq);

module.exports = FriendRoute;
