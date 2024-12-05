const User = require("../../model/userModel");
const bcrypt = require("bcrypt");

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
const updateProfile = async (req, res) => {
  try {
    const uid = req.header["uid"];
    const { name, newPass } = req.body;

    const updatedFields = { name };
    if (newPass) updatedFields.password = await bcrypt.hash(newPass, 10);

    const user = await User.findOneAndUpdate(
      { _id: uid },
      { $set: updatedFields },
      { new: true }
    );

    if (!user) {
      return res.send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getProfileData, updateProfile };
