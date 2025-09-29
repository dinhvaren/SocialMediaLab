require("dotenv").config();
const express = require("express");
const route = require("./routes");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./database/db");
const app = express();

app.use(cookieParser());
// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/image", express.static(path.join(__dirname, "..", "image")));
app.use(express.static(path.join(__dirname, "..", "views")));

const isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
//test
const port = process.env.PORT;
const host = process.env.HOST;

db.connect();
// rất quan trọng khi deploy
app.set("trust proxy", 1);

route(app);

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
