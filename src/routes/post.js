const express = require("express");
const router = express.Router();
const { PostController } = require("../app/controllers");
const requireLogin = require("../app/middlewares/auth");
const commentRouter = require("./comment");

router.get("/", PostController.list.bind(PostController));
router.post(
  "/create",
  requireLogin,
  PostController.create.bind(PostController)
);
router.get("/:id", PostController.detail.bind(PostController));
router.get("/view/:id", (req, res) => {
  res.sendFile("post_detail.html", { root: "src/views" });
});
router.use("/:postId/comments", commentRouter);

module.exports = router;
