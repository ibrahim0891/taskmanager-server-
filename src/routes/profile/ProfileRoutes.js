const {
  getProfileData,
  updateProfile,
} = require("../controller/ProfileController");

const ProfileRoutes = require("express").Router();

ProfileRoutes.get("/", getProfileData);
ProfileRoutes.put("/", updateProfile);

module.exports = ProfileRoutes;
