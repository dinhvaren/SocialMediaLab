const express = require("express");
const router = express.Router({ mergeParams: true });
const {CommentController} = require("../app/controllers");
const requireLogin = require("../app/middlewares/auth");

router.get("/", CommentController.list.bind(CommentController));
router.post("/", requireLogin, CommentController.create.bind(CommentController));
router.delete("/:commentId", requireLogin, CommentController.delete.bind(CommentController));

module.exports = router;
