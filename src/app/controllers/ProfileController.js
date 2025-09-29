const { pool } = require("../../database/db");

class ProfileController {
  showProfile(req, res) {
    // yêu cầu phải login (route nên dùng middleware requireLogin)
    return res.sendFile("profile.html", { root: "src/views" });
  }

  // API: lấy dữ liệu profile hiện tại của user (JSON)
  async getProfileData(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const sql =
        "SELECT id, username, display_name, email FROM users WHERE id = ?";
      const [rows] = await pool.query(sql, [userId]);

      if (rows.length === 0)
        return res.status(404).json({ error: "User not found" });

      // trả về data để client prefill form
      const user = rows[0];
      return res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  // API: cập nhật profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const displayName = req.body.displayName || "";
      const email = req.body.email || "";
      const password = req.body.password || "";

      if (!displayName)
        return res.status(400).json({ error: "displayName is required" });
      if (!email) return res.status(400).json({ error: "email is required" });

      let sql;
      if (password) {
        sql = `UPDATE users SET display_name = '${displayName}', email = '${email}', pass = '${password}' WHERE id = ${userId}`;
      } else {
        sql = `UPDATE users SET display_name = '${displayName}', email = '${email}' WHERE id = ${userId}`;
      }

      await pool.query(sql);

      return res.json({ ok: true, message: "Profile updated (vulnerable)" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProfileController();
