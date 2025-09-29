const authRouter = require("./auth");
const postRouter = require("./post");
const profileRouter = require("./profile");
const dashboardRouter = require("./dashboard");

function route(app) {
  app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.redirect("/auth/login");
  });
  app.use("/auth", authRouter);
  app.use("/posts", postRouter);
  app.use("/profile", profileRouter);
  app.use("/dashboard", dashboardRouter);

}
module.exports = route;
