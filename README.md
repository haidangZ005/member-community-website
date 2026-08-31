# Common Ground

Common Ground là website cộng đồng dành cho thành viên. Người dùng có thể tạo tài khoản, đăng nhập, cập nhật hồ sơ, đăng bài viết, thích bài viết và bình luận.

## Cách dự án hoạt động

```text
Trình duyệt (React)
        ↓ gọi API
Backend (Express)
        ↓ xử lý nghiệp vụ
PostgreSQL
```

- Frontend React hiển thị giao diện và gọi API bằng Axios.
- Backend Express kiểm tra dữ liệu, xác thực người dùng và xử lý nghiệp vụ theo Clean Architecture.
- PostgreSQL lưu tài khoản, phiên đăng nhập, chuyên mục, bài viết, lượt thích và bình luận.
- Access token được gửi qua header. Refresh token được lưu trong cookie `HttpOnly`.

## Chức năng hiện có

- Đăng ký, đăng nhập, đăng xuất và khôi phục mật khẩu.
- Xem và cập nhật hồ sơ cá nhân.
- Xem danh sách bài viết, phân trang và lọc theo chuyên mục.
- Tạo, xem, sửa và xóa bài viết của chính mình.
- Thích hoặc bỏ thích bài viết.
- Viết và xem bình luận.

## Cách chạy dự án

### 1. Chuẩn bị

Cài đặt:

- Node.js 20 trở lên.
- Docker Desktop.

Mở PowerShell tại thư mục dự án và chạy:

```powershell
npm run install:all
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Hai lệnh `Copy-Item` chỉ cần chạy lần đầu. Nếu file `.env` đã tồn tại thì bỏ qua.

### 2. Khởi động database

Mở Docker Desktop, sau đó chạy:

```powershell
docker compose up -d postgres
```

Tạo các bảng trong database:

```powershell
$env:DATABASE_URL = "postgresql://postgres:password@localhost:5432/member_community_db"
npm run migrate:up --prefix backend
```

### 3. Khởi động backend

```powershell
npm run dev:backend
```

Backend chạy tại `http://localhost:4000`.

Có thể kiểm tra bằng đường dẫn: `http://localhost:4000/api/health`.

### 4. Khởi động frontend

Giữ backend đang chạy, mở một cửa sổ PowerShell khác và chạy:

```powershell
npm run dev:frontend
```

Mở `http://localhost:5173` trên trình duyệt. Đăng ký một tài khoản mới, sau đó đăng nhập để thử các chức năng cộng đồng.

## Cấu trúc chính

```text
backend/
  src/domain/          Entity và quy tắc nghiệp vụ
  src/application/     Các use case
  src/interfaces/      API, controller và validation
  src/infrastructure/  PostgreSQL, JWT, bcrypt và email

frontend/
  src/pages/           Các trang giao diện
  src/features/        Auth, bài viết và bình luận
  src/components/      Component dùng chung
```

## Kiểm tra mã nguồn

```powershell
npm test
npm run lint --prefix backend
npm run lint --prefix frontend
npm run build
```

## Dừng database

```powershell
docker compose down
```

Dữ liệu vẫn được giữ trong Docker volume để dùng cho lần chạy tiếp theo.
