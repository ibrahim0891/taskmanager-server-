const User = require("../model/userModel");

const getUsers = async (req, res) => {
  try {
    const uid = req.headers["uid"];
    if (!uid) {
      return res.status(400).send({ message: "UID is required" });
    }

    const users = await User.find({ _id: { $ne: uid } });
    if (!users || users.length === 0) {
      return res.status(404).send({ message: "No Users Found" });
    }

    const Me = await User.findOne({ _id: uid });
    if (!Me) {
      return res.status(404).send({ message: "User not found" });
    }

    const updatedUsers = users.map((user) => {
      if (Me.friends.includes(user._id.toString())) {
        return { ...user._doc, Status: "friends" };
      } else if (Me.pendingFR.includes(user._id.toString())) {
        return { ...user._doc, Status: "pending" };
      } else if (Me.sentFR.includes(user._id.toString())) {
        return { ...user._doc, Status: "sent" };
      } else {
        return { ...user._doc, Status: "none" };
      }
    });

    res.status(200).send(updatedUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const addFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];
    if (!uid || !id) {
      return res
        .status(400)
        .send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });
    if (!Me || !Friend) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!Me.pendingFR.includes(id)) {
      Me.pendingFR.push(id);
      Friend.sentFR.push(uid);
    }

    await Me.save();
    await Friend.save();

    res.status(200).send({ message: "Friend request sent", Me });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const acceptReq = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];
    if (!uid || !id) {
      return res
        .status(400)
        .send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });
    if (!Me || !Friend) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!Me.friends.includes(Friend._id.toString())) {
      Me.friends.push(Friend._id);
      Friend.friends.push(Me._id);

      Me.pendingFR = Me.pendingFR.filter((fr) => fr.toString() !== id);
      Friend.sentFR = Friend.sentFR.filter((fr) => fr.toString() !== uid);
    }

    await Me.save();
    await Friend.save();

    res.status(200).send({ message: "Friend request accepted", Me });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const cancelReq = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];
    if (!uid || !id) {
      return res
        .status(400)
        .send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });
    if (!Me || !Friend) {
      return res.status(404).send({ message: "User not found" });
    }

    Me.pendingFR = Me.pendingFR.filter((fr) => fr.toString() !== id);
    Friend.sentFR = Friend.sentFR.filter((fr) => fr.toString() !== uid);

    await Me.save();
    await Friend.save();

    res.status(200).send({ message: "Friend request canceled", Me });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.headers["uid"];
    if (!uid || !id) {
      return res
        .status(400)
        .send({ message: "UID and Friend ID are required" });
    }

    const Me = await User.findOne({ _id: uid });
    const Friend = await User.findOne({ _id: id });
    if (!Me || !Friend) {
      return res.status(404).send({ message: "User not found" });
    }

    Me.friends = Me.friends.filter((fr) => fr.toString() !== id);
    Friend.friends = Friend.friends.filter((fr) => fr.toString() !== uid);

    await Me.save();
    await Friend.save();

    res.status(200).send({ message: "Friend removed", Me });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { getUsers, addFriends, deleteFriend, acceptReq, cancelReq };
