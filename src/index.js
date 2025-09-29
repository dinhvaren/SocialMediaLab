require("dotenv").config();
const express = require("express");
const route = require("./routes");
const session = require("express-session");
const path = require("path");

// Khởi tạo ứng dụng Express
const app = express();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "views")));
// session (dùng SESSION_SECRET từ .env)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-dev",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // or simply false during dev
  })
);

// Định nghĩa cổng chạy server
const port = process.env.PORT;
const host = process.env.HOST;

// Import cấu hình database
const db = require("./database/db");

// Kết nối đến cơ sở dữ liệu
db.connect();

// rất quan trọng khi deploy
app.set("trust proxy", 1);

route(app);

// Lắng nghe kết nối tại cổng được chỉ định
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
