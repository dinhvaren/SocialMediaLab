const { pool } = require("../../database/db");

class CommentController {
  // List comments for a post (returns JSON array)
  async list(req, res, next) {
    try {
      const postId = req.params.postId;
      const sql = `SELECT c.id, c.content, c.author_id, u.username, c.created_at
                   FROM comments c
                   LEFT JOIN users u ON c.author_id = u.id
                   WHERE c.post_id = ${postId}
                   ORDER BY c.created_at ASC`;
      const [rows] = await pool.query(sql);
      return res.json({ comments: rows });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const postId = req.params.postId;
      const content = req.body.content || "";

      // Simple validation
      if (!content.trim()) {
        return res.status(400).json({ error: "Empty comment" });
      }

      const sql = `INSERT INTO comments (post_id, author_id, content) VALUES (${postId}, ${userId}, '${content}')`;
      await pool.query(sql);

      return res.json({ ok: true, message: "Comment added (vulnerable)" });
    } catch (err) {
      next(err);
    }
  }

  // (Optional) delete comment - teacher may expose later for IDOR challenges
  async delete(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const sqlCheck = `SELECT author_id FROM comments WHERE id = ${commentId} LIMIT 1`;
      const [r] = await pool.query(sqlCheck);
      if (!r || r.length === 0) return res.status(404).json({ error: "Not found" });

      const owner = r[0].author_id;
      if (owner !== userId && req.session.roleId !== 2) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const sqlDel = `DELETE FROM comments WHERE id = ${commentId}`;
      await pool.query(sqlDel);
      return res.json({ ok: true, message: "Deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();