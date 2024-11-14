const User = require("../model/userModel");

const getProfileData = async (req, res) => {
  try {
    const uid = req.header.uid;

    const findUser = await User.findOne({ uid });

    if (!findUser) {
      return res.status(408).json({ message: "User Not Find" });
    }

    await res.send(findUser);
  } catch (error) {}
};

module.exports = { getProfileData };
