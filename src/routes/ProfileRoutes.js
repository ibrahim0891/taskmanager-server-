const { getProfileData } = require("../controller/ProfileController");

const ProfileRoutes = require("express").Router();

ProfileRoutes.get("/", getProfileData);

module.exports = ProfileRoutes;
