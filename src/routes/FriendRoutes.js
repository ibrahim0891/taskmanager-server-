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
FriendRoute.delete("/:id", deleteFriend);
FriendRoute.put("/:id", acceptReq);
FriendRoute.put("/:id", cancelReq);

module.exports = FriendRoute;
