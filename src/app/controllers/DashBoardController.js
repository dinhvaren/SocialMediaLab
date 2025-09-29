const path = require("path");

class DashBoardController {

  showDashboard(req, res) {
    if (!req.session.userId) {
      return res.redirect("/auth/login");
    }
    // load file dashboard.html trong views
    return res.sendFile("dashboard.html",{ root: "src/views" });
  }

  // API trả về thông tin cơ bản của user để fill Dashboard
  me(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({
      id: req.session.userId,
      username: req.session.username,
      role: req.session.roleId,
    });
  }
}

module.exports = new DashBoardController();