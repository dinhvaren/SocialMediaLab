const express = require("express");
const router = express.Router();
const { PostController } = require("../app/controllers");
const requireLogin = require("../app/middlewares/auth");

router.get("/", PostController.list.bind(PostController));
router.post("/create", requireLogin, PostController.create.bind(PostController));
router.get("/:id", PostController.detail.bind(PostController));

module.exports = router;
