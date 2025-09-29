-- sql/init.sql
-- Lab DB schema for MiniSocial CTF lab
-- NOTE: file must be saved as UTF-8 before importing

-- ensure client uses utf8mb4 during import
SET NAMES utf8mb4;
SET SESSION collation_connection = 'utf8mb4_unicode_ci';

CREATE DATABASE IF NOT EXISTS SocialMediaLab
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
USE SocialMediaLab;

-- Roles
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) DEFAULT NULL,
  pass VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  role_id INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_username(username),
  CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts
DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  content TEXT NOT NULL,
  visibility ENUM('public','private') NOT NULL DEFAULT 'public',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_posts_author(author_id),
  INDEX idx_posts_visibility(visibility),
  CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments
DROP TABLE IF EXISTS comments;
CREATE TABLE IF NOT EXISTS comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_comments_post(post_id),
  INDEX idx_comments_author(author_id),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Flags (CTF target)
DROP TABLE IF EXISTS flags;
CREATE TABLE IF NOT EXISTS flags (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- roles
INSERT INTO roles (name, description) VALUES
('user', 'Standard user role'),
('admin', 'Administrator role with extra rights');

-- users (plain-text passwords for lab)
INSERT INTO users (username, email, pass, display_name, avatar, role_id) VALUES
('dangkhoa', 'dangkhoa@example.com', 'dangkhoapass', 'Đăng Khoa', '/image/logo.png', 1),
('bob',   'bob@example.com',   'crushpass',   'crush',   '/image/logo.png', 1),
('admin', 'admin@example.com', 'adminpass', 'Administrator', '/image/logo.png', 2);

-- posts
INSERT INTO posts (author_id, content, visibility) VALUES
(1, 'Xin chào! Đây là bài public của Đăng Khoa.', 'public'),
(1, 'Đăng Khoa private FLAG vhuCTF{!l0rtn0c_5s3c_ca_n3k0rb!} - chỉ Đăng Khoa xem được.', 'private'),
(2, 'Bob public post - chào mọi người!', 'public'),
(3, 'Admin announcement - public', 'public');

-- comments
INSERT INTO comments (post_id, author_id, content) VALUES
(1, 2, 'Bob: Nice post Đăng Khoa!'),
(1, 3, 'Admin: Thanks for sharing.'),
(3, 1, 'Đăng Khoa: Welcome Bob!');

-- flags (CTF)
INSERT INTO flags (name, value) VALUES
('hidden_flag', 'vhuCTF{pw:sql_inject10n;lvl=easy}');
