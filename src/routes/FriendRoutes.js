const FriendRoute = require("express").Router();

const {
  getUsers,
  addFriends,
  deleteFriend,
  acceptReq,
  cancelReq,
  getFriends,
} = require("../controller/FriendController");

FriendRoute.get("/", getUsers);
FriendRoute.post("/addFriend/", addFriends);
FriendRoute.post("/deleteFriend/:id", deleteFriend);
FriendRoute.post("/acceptReq/", acceptReq);
FriendRoute.post("/cancelReq", cancelReq);

FriendRoute.get('/getFriends', getFriends);

module.exports = FriendRoute;
