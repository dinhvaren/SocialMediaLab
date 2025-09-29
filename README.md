# MiniSocial Lab

[MiniSocial](https://vhu-minisocial.io.vn/) là một dự án lab nhỏ về mạng xã hội tối giản, được thiết kế để học và thực hành bảo mật web (XSS, SQLi, session, IDOR, CSRF, v.v.).  
Lab này có các chức năng cơ bản: đăng ký / đăng nhập, dashboard, đăng bài viết, xem chi tiết bài viết, bình luận (comment), profile người dùng.


## 🧩 Kiến trúc & công nghệ sử dụng

- **Backend**: Node.js + Express  
- **Database**: MySQL (Docker container)  
- **Session / Authentication**: express-session + cookie  
- **Frontend**: HTML + Fetch API (vanilla JS)  
- **Containerization**: Docker, Docker Compose  
- **Reverse Proxy & HTTPS (tuỳ chọn)**: Nginx + Certbot  
- **Môi trường lab**: thiết kế có lỗ hổng cố tình cho sinh viên học tấn công & bảo vệ (ví dụ Stored XSS, SQL injection, IDOR)  


## 📦 Cấu trúc dự án

```

.
├── docker-compose.yml
├── Dockerfile
├── deploy.sh
├── README.md
├── src
│   ├── app
│   │   ├── controllers
│   │   ├── middlewares
│   │   └── routes
│   ├── database
│   │   └── db.js
│   ├── views
│   │   ├── auth.html
│   │   ├── dashboard.html
│   │   ├── post_detail.html
│   │   ├── profile.html
│   │   └── ...
│   ├── index.js
│   └── sql
│       └── init.sql
├── image
│   └── logo.png
├── .env.development
├── .env.production
└── .gitignore

````

## 🚀 Hướng dẫn khởi chạy (local / development)

1. Cài Docker + Docker Compose  
2. Clone repo, cd vào thư mục gốc  
3. Chuẩn bị file `.env.development` (theo mẫu trong repo)  
4. Chạy:

```bash
docker-compose up -d
````

5. Truy cập ứng dụng: **[http://localhost:3000](http://localhost:3000)**


## 🛡 Những lỗ hổng lab & challenge

| Vị trí                 | Lỗ hổng tiềm năng     | Mục đích lab                          |
| ---------------------- | --------------------- | ------------------------------------- |
| AuthController (login) | SQL Injection         | Thử `' OR '1'='1` để bypass / gây lỗi |
| Post & Comment         | Stored XSS            | Payload `<script>alert(1)</script>`   |
| Dashboard              | IDOR                  | Truy cập bài viết private bằng đổi ID |
| Delete comment         | Broken Access Control | Xoá comment của user khác             |


## 🔐 Deploy (production)

* Sử dụng `.env.production`
* Nginx reverse proxy + HTTPS bằng Certbot
* Cookie `secure: true` khi chạy HTTPS
* `app.set("trust proxy", 1)` để session hoạt động qua proxy


## ✅ Checklist

* [ ] File `.env.production` đầy đủ
* [ ] `docker-compose up -d` ok
* [ ] Nginx + SSL certbot ok
* [ ] Login / Post / Comment test ok
* [ ] Payload XSS / SQLi hoạt động để khai thác


## 📚 Mở rộng

* CSRF token
* Template engine (EJS, Pug)
* Upload ảnh avatar, post image
* Role-based access control (Admin/User)
* JWT + Refresh Token


## 👤 Tác giả

* **Tên**: Lương Nguyễn Ngọc Đình
* **Trường**: Đại học Văn Hiến (Van Hien University)
* **Chuyên ngành**: An toàn thông tin (Information Security)
* **Liên hệ**: [GitHub](https://github.com/dinhvaren) • [Blog](https://d1nhvar3n-blog.io.vn)


> 📌 Lab này được xây dựng nhằm mục đích học tập và nghiên cứu bảo mật. **Không sử dụng trong môi trường production thực tế.**