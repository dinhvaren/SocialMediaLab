const { pool } = require("../../database/db");

class PostController {
  // Hiển thị danh sách post (public + private nếu là chủ sở hữu)
  async list(req, res, next) {
    try {
      const userId = req.session.userId || 0;
      const keyword = req.query.q || "";
      const sql = `
      SELECT p.id, p.content, p.visibility, p.author_id, u.username
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.content LIKE '%${keyword}%'
        AND (p.visibility = 'public' OR p.author_id = ${userId})
      ORDER BY p.created_at DESC
    `;
      const [rows] = await pool.query(sql);

      res.json({ posts: rows });
    } catch (err) {
      next(err);
    }
  }

  // Tạo post mới
  async create(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { content, visibility } = req.body;
      const sql = `INSERT INTO posts (author_id, content, visibility) VALUES (${userId}, '${content}', '${
        visibility || "public"
      }')`;
      await pool.query(sql);

      res.json({ ok: true, message: "Post created (vulnerable)" });
    } catch (err) {
      next(err);
    }
  }

  // Xem chi tiết post
  async detail(req, res, next) {
    try {
      const postId = req.params.id;
      const userId = req.session.userId;

      const sql = `SELECT p.*, u.username FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ${postId}`;
      const [rows] = await pool.query(sql);

      if (rows.length === 0)
        return res.status(404).json({ error: "Post not found" });

      const post = rows[0];

      if (post.visibility === "private" && post.author_id !== userId) {
        return res.json({ post, note: "Bạn vừa khai thác IDOR thành công 😈" });
      }

      res.json({ post });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();
