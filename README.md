# VRUM

> Làn gió mới của diễn đàn Việt — The Fresh Air of VN Forums.

Đây là mã nguồn của **VRUM**, một diễn đàn cộng đồng hiện đại dành cho việc thảo luận, chia sẻ kiến thức và kết nối những người có cùng mối quan tâm. Thành viên có thể tạo tài khoản, cập nhật hồ sơ, đăng bài, bình luận và thích nội dung; quản trị viên có khu vực riêng để quản lý thành viên, bài viết, bình luận và chuyên mục.

Dự án gồm frontend React, REST API Express và PostgreSQL. Giao diện hỗ trợ chế độ sáng, tối và tự nhận diện theo thiết bị.

## Cách hoạt động

```text
Trình duyệt React → REST API Express → PostgreSQL
```

- Backend được tổ chức theo Clean Architecture, kiểm tra dữ liệu bằng Zod.
- Access token dùng để gọi API; refresh token nằm trong cookie `HttpOnly`.
- Mật khẩu được băm bằng bcrypt trước khi lưu vào database.
- Route quản trị yêu cầu đăng nhập và role `admin`.

## Chạy khi phát triển

Cần Node.js 20+ và PostgreSQL 16+. Có thể dùng PostgreSQL đã cài trên máy hoặc container Docker bên dưới.

```powershell
npm run install:all
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Sửa `DATABASE_URL` và các JWT secret trong `backend/.env`, sau đó chuẩn bị database:

```powershell
docker compose up -d postgres
npm run migrate:up --prefix backend
```

Nếu PostgreSQL đang chạy trực tiếp trên máy, không cần chạy lệnh Docker; chỉ cần `DATABASE_URL` trỏ đúng database, tài khoản và mật khẩu của PostgreSQL đó.

Mở hai cửa sổ PowerShell:

```powershell
npm run dev:backend
```

```powershell
npm run dev:frontend
```

Truy cập `http://localhost:5173`. API chạy tại `http://localhost:4000`, health check là `http://localhost:4000/api/health`.

## Tạo dữ liệu ban đầu

Tạo hoặc cập nhật admin:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "MatKhauRiengCuaBan"
npm run seed:admin --prefix backend
Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_USERNAME, Env:ADMIN_PASSWORD
```

Hãy đổi mật khẩu ví dụ trước khi chạy. Seed sẽ băm mật khẩu bằng bcrypt; database chỉ lưu chuỗi băm.

Tạo ba thành viên, bài viết, bình luận và lượt thích để demo:

```powershell
$env:DEMO_PASSWORD = "MatKhauDemo123"
npm run seed:demo --prefix backend
Remove-Item Env:DEMO_PASSWORD
```

Các tài khoản demo được in ra sau khi seed. Chạy lại lệnh sẽ làm mới dữ liệu của chính các tài khoản demo, không xóa dữ liệu người dùng khác.

## Chạy toàn bộ bằng Docker

Đảm bảo cổng `5432`, `4000` và `5173` chưa được chương trình khác sử dụng:

```powershell
$env:JWT_ACCESS_SECRET = "mot-access-secret-dai-va-ngau-nhien"
$env:JWT_REFRESH_SECRET = "mot-refresh-secret-khac-va-ngau-nhien"
docker compose --profile app up --build
```

Migration được chạy tự động khi backend khởi động. Mở `http://localhost:5173`; nhấn `Ctrl+C` rồi chạy `docker compose --profile app down` để dừng.

## Kiểm tra

Chạy kiểm tra thông thường:

```powershell
npm test
npm run lint --prefix backend
npm run lint --prefix frontend
npm run build
```

Chạy integration test với PostgreSQL riêng trên cổng `5433`:

```powershell
docker compose --profile test up -d postgres-test
$env:TEST_DATABASE_URL = "postgresql://postgres:test_password@localhost:5433/member_community_test_db"
npm run test:integration --prefix backend
Remove-Item Env:TEST_DATABASE_URL
docker compose --profile test stop postgres-test
```

GitHub Actions cũng tự động chạy lint, test, integration test và frontend build cho mỗi pull request.

## Triển khai

- Dùng HTTPS và đặt `COOKIE_SECURE=true` ở backend.
- Tạo `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` riêng trên nền tảng triển khai; không commit file `.env`.
- Chạy migration trước khi mở API. Docker image backend đã có lệnh migration và frontend image phục vụ SPA qua Nginx.
- Chạy `seed:admin` với mật khẩu thật, sau đó xóa các biến `ADMIN_*` khỏi môi trường nếu không còn cần.

## Thư mục chính

```text
backend/src/domain/          Entity và quy tắc nghiệp vụ
backend/src/application/     Use case
backend/src/interfaces/      HTTP controller, route và validation
backend/src/infrastructure/  PostgreSQL, JWT, bcrypt và email
frontend/src/                Trang React, component và API client
```
