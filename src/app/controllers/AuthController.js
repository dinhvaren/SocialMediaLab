const { pool } = require("../../database/db");

class AuthController {
  showLogin(req, res) {
    res.sendFile("auth.html", { root: "src/views" });
    // sau này nếu dùng ejs thì đổi thành res.render("login", {error:null})
  }

  // Xử lý login
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const sql = `SELECT id, username FROM users WHERE username = "${username}" AND pass = "${password}"`;

      console.log("DEBUG SQL:", sql);

      const [rows] = await pool.query(sql);

      if (rows.length === 0) {
        return res.status(401).send("Sai username hoặc mật khẩu");
      }

      req.session.userId = rows[0].id;
      req.session.username = rows[0].username;

      res.cookie("lab_session", `${rows[0].username}:${rows[0].id}`, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.redirect("/dashboard");
    } catch (err) {
      console.error("SQL Error:", err);
      res.status(500).send("Lỗi DB: " + err.message);
    }
  }

  // Hiển thị trang register
  showRegister(req, res) {
    res.send("<h2>Register page (TODO form)</h2>");
  }

  // Xử lý register
  async register(req, res, next) {
    try {
      const { username, password } = req.body;

      const [exist] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      if (exist.length > 0) {
        return res.status(400).send("Username đã tồn tại");
      }

      await pool.query("INSERT INTO users (username, pass) VALUES (?, ?)", [
        username,
        password,
      ]);

      res.redirect("/auth/login");
    } catch (err) {
      next(err);
    }
  }

  // Logout
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  }
}

module.exports = new AuthController();
