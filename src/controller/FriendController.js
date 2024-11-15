const User = require("../model/userModel");

const getUsers = async (req, res) => {
  try {
    const uid = req.header["uid"];
    const users = await User.find({ $ne: { uid } });
    if (!users) {
      return res.send("No User Found Insted of You");
    }
    res.send(users);
  } catch (error) {}
};

const addFriends = async (req, res) => {
  const { id } = req.params;
  const uid = req.header["uid"];

  const Me = User.findOne({ uid });
};

const acceptReq = async (req, res) => {
  const { id } = req.params;
  const uid = req.header["uid"];
};

const cancelReq = async (req, res) => {
  const { id } = req.params;
  const uid = req.header["uid"];
};

const deleteFriend = async (req, res) => {};

module.exports = { getUsers, addFriends, deleteFriend, acceptReq, cancelReq };
