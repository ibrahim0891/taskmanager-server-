const User = require("../model/userModel");

const getUsers = async (req, res) => {
  try {
    const uid = req.headers["uid"];
    const users = await User.find({ _id: { $ne: uid } });
    if (!users) {
      return res.send("No User Found Insted of You");
    }
    res.send(users);
  } catch (error) {}
};

const addFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];

    if (!uid || !id) {
      return res.send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });

    if (!Me || !Friend) {
      return res.send("User not found");
    }

    if (!Me.pendingFR.includes(id)) {
      Me.pendingFR.push(id);
      Friend.sentFR.push(uid);
    }

    await Me.save();
    await Friend.save();

    await res.send(Me, { FrStatus: "pending" });
  } catch (error) {
    console.log(error);
  }
};

const acceptReq = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];

    if (!uid || !id) {
      return res.send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });

    if (!Me || !Friend) {
      return res.send("User not found");
    }

    Me.friends.push(Friend._id);
    Friend.friends.push(Me._id);

    Me.pendingFR = Me.pendingFR.filter((fr) => fr.toString() !== id);
    Friend.sentFR = Friend.sentFR.filter(
      (fr) => fr.toString() !== Me._id.toString()
    );

    await Me.save();
    await Friend.save();

    await res.send({ Me, FrStatus: "friends" });
  } catch (error) {
    console.log(error);
  }
};

const cancelReq = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];

    if (!uid || !id) {
      return res.send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });

    if (!Me || !Friend) {
      return res.send("User not found");
    }

    Me.pendingFR = Me.pendingFR.filter((fr) => fr.toString() !== id);
    Friend.sentFR = Me.sentFR.filter(
      (fr) => fr.toString() !== Me._id.toString()
    );

    await Me.save();
    await Friend.save();
    await res.send(Me, { FrStatus: "add friend" });
  } catch (error) {
    console.log(error);
  }
};

const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];

    if (!uid || !id) {
      return res.send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.deleteOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });

    if (!Me || !Friend) {
      return res.send("User not found");
    }
    Me.friends = Me.friends.filter((fr) => fr.toString() !== id);
    Friend.friends = Me.friends.filter(
      (fr) => fr.toString() !== Me._id.toString()
    );

    await Me.save();
    await Friend.save();
    await res.send(Me, { FrStatus: "add friend" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUsers, addFriends, deleteFriend, acceptReq, cancelReq };
