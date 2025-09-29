require("dotenv").config();
const mysql = require("mysql2/promise");

// Tạo pool kết nối
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: "utf8mb4_unicode_ci",
  waitForConnections: true,
  connectionLimit: 10,
});

async function connect() {
  try {
    const conn = await pool.getConnection();

    await conn.query("SET NAMES utf8mb4");
    await conn.query(
      "SET SESSION collation_connection = 'utf8mb4_unicode_ci'"
    );

    console.log("✅ MySQL connected with UTF8MB4!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection error:", err.message);
  }
}

module.exports = { connect, pool };
