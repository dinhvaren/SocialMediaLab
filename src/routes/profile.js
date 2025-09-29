const express = require("express");
const router = express.Router();
const { ProfileController } = require("../app/controllers");
const requireLogin = require("../app/middlewares/auth");

router.get("/", requireLogin, ProfileController.showProfile.bind(ProfileController));
router.get("/me", requireLogin, ProfileController.getProfileData.bind(ProfileController));
router.post("/update", requireLogin, ProfileController.updateProfile.bind(ProfileController));

module.exports = router;
