const authRouter = require("./auth");
const postRouter = require("./post");
const profileRouter = require("./profile");
const dashboardRouter = require("./dashboard");
const commentRouter = require("./comment");

function route(app) {
  app.get("/", (req, res) => {
    res.redirect("/auth/login");
  });
  app.use("/auth", authRouter);
  app.use("/posts", postRouter);
  app.use("/profile", profileRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/:postId/comments", commentRouter);

}
module.exports = route;
