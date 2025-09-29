require("dotenv").config();
const express = require("express");
const route = require("./routes");
const session = require("express-session");
const path = require("path");
const db = require("./database/db");
const app = express();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/image", express.static(path.join(__dirname, "..", "image")));
app.use(express.static(path.join(__dirname, "..", "views")));
// rất quan trọng khi deploy
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // chỉ bật khi chạy HTTPS
      sameSite: "lax",
    },
  })
);
//test
const port = process.env.PORT;
const host = process.env.HOST;

db.connect();

route(app);

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
