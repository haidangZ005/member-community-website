# Common Ground — Member Community Website

Phiên bản Sprint 1 của nền tảng cộng đồng thành viên, triển khai theo tài liệu kiến trúc trong repository: Node.js + Express, React + Vite, PostgreSQL và Clean Architecture.

## Chức năng Sprint 1

- Đăng ký tài khoản với kiểm tra email/tên người dùng trùng và mật khẩu an toàn.
- Đăng nhập bằng access token JWT; refresh token được băm trong PostgreSQL và gửi qua cookie `HttpOnly`.
- Xoay vòng refresh token, khôi phục phiên khi tải lại trang và đăng xuất/thu hồi token.
- Quên mật khẩu với phản hồi chống dò email, token một lần có hạn 30 phút và email qua SMTP.
- Đặt lại mật khẩu, vô hiệu hóa token reset và thu hồi mọi phiên cũ.
- Xem/cập nhật hồ sơ cá nhân qua route được bảo vệ.
- Giao diện responsive cho đăng ký, đăng nhập, quên/đặt lại mật khẩu và hồ sơ.

## Cấu trúc

```text
backend/src/
  domain/          Entities, errors và repository contracts
  application/     Auth/profile use cases và service ports
  interfaces/      Controllers, routes, validators, middleware
  infrastructure/  PostgreSQL repositories, JWT, bcrypt, email
  main/            Composition root và Express server

frontend/src/
  app/             Router và providers
  pages/           Các trang theo route
  features/auth/   API, hooks, schema và form xác thực
  components/      UI/layout dùng chung
  services/        Axios client và interceptor refresh token
  store/           Zustand auth store
```

`domain/` và `application/` của backend không phụ thuộc Express hoặc PostgreSQL.

## Chạy dự án

Yêu cầu: Node.js 20+, npm và PostgreSQL 15+; hoặc Docker cho database.

```bash
npm run install:all
docker compose up -d postgres
```

Sao chép cấu hình mẫu và thay các JWT secret bằng chuỗi ngẫu nhiên mạnh:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run migrate:up --prefix backend
```

Chạy hai tiến trình trong hai terminal:

```bash
npm run dev:backend
npm run dev:frontend
```

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`

Nếu không cấu hình SMTP, email reset được tạo bằng `jsonTransport` để môi trường phát triển không gửi email thật. Khi tích hợp SMTP, đặt `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` và `SMTP_FROM` trong `backend/.env`.

## API Sprint 1

| Method | Endpoint | Xác thực |
|---|---|---|
| POST | `/api/auth/register` | Guest |
| POST | `/api/auth/login` | Guest |
| POST | `/api/auth/refresh` | Refresh cookie |
| POST | `/api/auth/logout` | Refresh cookie |
| POST | `/api/auth/forgot-password` | Guest |
| POST | `/api/auth/reset-password` | Reset token |
| GET | `/api/users/me` | Bearer access token |
| PUT | `/api/users/me` | Bearer access token |

Mọi response dùng `{ "data": ... }`; mọi lỗi dùng `{ "error": { "code": "...", "message": "..." } }`.

## Kiểm tra chất lượng

```bash
npm test
npm run lint --prefix backend
npm run lint --prefix frontend
npm run build
```

Test backend dùng repository/service giả lập nên không cần database thật. Migration và PostgreSQL repository được dùng khi chạy ứng dụng thực tế.

## Ghi chú bảo mật

- Không commit `.env`; repository chỉ lưu `.env.example`.
- Access token chỉ nằm trong bộ nhớ Zustand, không lưu vào `localStorage`.
- Refresh/reset token chỉ được lưu dạng SHA-256 hash trong database.
- Refresh cookie dùng `HttpOnly`, `SameSite=Strict` và bật `Secure` ở production.
- API auth có rate limit; input được kiểm tra bằng Zod; lỗi được xử lý tập trung và không lộ stack trace ở production.

