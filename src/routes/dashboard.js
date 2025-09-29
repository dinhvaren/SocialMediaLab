const express = require("express");
const router = express.Router();
const { DashBoardController } = require("../app/controllers");

router.get("/", DashBoardController.showDashboard.bind(DashBoardController));
router.get("/me", DashBoardController.me.bind(DashBoardController));

module.exports = router;