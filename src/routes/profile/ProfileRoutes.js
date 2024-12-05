const {
  getProfileData,
  updateProfile,
} = require("../../controller/profile/ProfileController");

const ProfileRoutes = require("express").Router();

ProfileRoutes.get("/", getProfileData);
ProfileRoutes.put("/", updateProfile);

module.exports = ProfileRoutes;
  