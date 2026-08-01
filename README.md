# Study Goal Tracker — IT4409

Ứng dụng web quản lý mục tiêu học tập cá nhân. Đồ án cuối kỳ môn IT4409 — Công nghệ Web và dịch vụ trực tuyến.

## Kiến trúc

Ba tầng tách rời, deploy độc lập:

```
Trình duyệt (React SPA — Vercel)
        ↓  HTTPS + JSON
REST API (Express — Render)
        ↓  Mongoose
MongoDB Atlas
```

## Công nghệ sử dụng

| Tầng | Công nghệ |
|---|---|
| Frontend | React 18, React Router, Context API, Axios, Vite |
| Giao diện | HTML5 semantic, CSS3 (Flexbox, Grid, Media Query) |
| Backend | Node.js, Express.js, express-validator |
| Database | MongoDB Atlas, Mongoose ODM |
| Xác thực | JWT (jsonwebtoken), bcryptjs |
| Đóng gói | Docker |
| CI | GitHub Actions |

## Chức năng

- Đăng ký / đăng nhập bằng JWT
- CRUD mục tiêu học tập: tạo, xem danh sách, xem chi tiết, sửa, xóa
- Cập nhật tiến độ nhanh bằng nút `+1`
- Lọc theo **môn học** và **trạng thái** (xử lý ở server bằng query param)
- Mỗi user chỉ thấy dữ liệu của chính mình
- Giao diện responsive cho cả desktop và mobile
- Validate 3 lớp: HTML5 → express-validator → Mongoose schema
- Xử lý lỗi tập trung, trả đúng mã HTTP

## Hướng dẫn chạy

### Yêu cầu
- Node.js 20 trở lên
- Tài khoản MongoDB Atlas (bản free)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Sửa file `.env`:

```
PORT=5000
MONGODB_URI=<chuỗi kết nối MongoDB Atlas>
JWT_SECRET=<chuỗi ngẫu nhiên dài>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Sinh `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Chạy:

```bash
npm run dev      # cổng 5000
```

Kiểm tra: mở `http://localhost:5000/api/health` phải thấy `{"status":"ok"}`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # cổng 5173
```

### 3. Chạy backend bằng Docker (tùy chọn)

```bash
cd backend
docker build -t study-goal-api .
docker run -p 5000:5000 --env-file .env study-goal-api
```

## Hướng dẫn deploy

### MongoDB Atlas
1. Tạo cluster free (M0)
2. Database Access: tạo user + password
3. **Network Access: thêm `0.0.0.0/0`** — không làm bước này thì Render không kết nối được
4. Copy connection string

### Backend lên Render
1. New → Web Service → kết nối repo GitHub
2. Root Directory: `backend`
3. Build Command: `npm install` — Start Command: `npm start`
4. Thêm Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
5. `CLIENT_URL` phải là URL Vercel thật, **không có dấu `/` ở cuối**

### Frontend lên Vercel
1. Import repo → Root Directory: `frontend`
2. Framework Preset: Vite
3. Environment Variable: `VITE_API_URL` = `https://<tên-app>.onrender.com/api`
4. File `vercel.json` đã có sẵn để xử lý routing của SPA

> **Thứ tự đúng:** deploy backend trước để lấy URL → điền vào `VITE_API_URL` của Vercel → deploy frontend → lấy URL Vercel → điền ngược lại vào `CLIENT_URL` của Render → redeploy backend.

## API

| Method | Endpoint | Auth | Trả về |
|---|---|---|---|
| POST | `/api/auth/register` | — | 201 |
| POST | `/api/auth/login` | — | 200 |
| GET | `/api/auth/me` | ✓ | 200 |
| GET | `/api/goals?subject=&status=` | ✓ | 200 |
| POST | `/api/goals` | ✓ | 201 |
| GET | `/api/goals/:id` | ✓ | 200 |
| PUT | `/api/goals/:id` | ✓ | 200 |
| PATCH | `/api/goals/:id/progress` | ✓ | 200 |
| DELETE | `/api/goals/:id` | ✓ | 204 |

### Mã trạng thái

| Mã | Khi nào |
|---|---|
| 200 | Lấy / sửa / xóa thành công |
| 201 | Tạo mới thành công |
| 204 | Xóa thành công, không có nội dung trả về |
| 400 | Dữ liệu gửi lên không hợp lệ |
| 401 | Chưa đăng nhập, token sai hoặc hết hạn |
| 404 | Không tìm thấy tài nguyên |
| 409 | Email đã tồn tại |
| 500 | Lỗi máy chủ |

## Cấu trúc thư mục

```
backend/
├── server.js                    # điểm vào, lắp chuỗi middleware
├── Dockerfile
├── .github/workflows/ci.yml
└── src/
    ├── config/db.js             # kết nối MongoDB
    ├── models/                  # User.js, Goal.js
    ├── middleware/              # auth.js, errorHandler.js, validate.js
    ├── controllers/             # authController.js, goalController.js
    ├── routes/                  # authRoutes.js, goalRoutes.js
    └── utils/                   # ApiError.js, asyncHandler.js

frontend/
├── index.html
├── vercel.json                  # rewrite cho SPA routing
└── src/
    ├── main.jsx
    ├── App.jsx                  # định nghĩa route
    ├── styles.css               # responsive, mobile-first
    ├── api/axiosClient.js       # interceptor gắn token
    ├── context/AuthContext.jsx  # Context API
    ├── components/              # PrivateRoute, Navbar, GoalCard
    └── pages/                   # Login, Register, Dashboard, GoalForm, GoalDetail
```

## Bảo mật

- Mật khẩu hash bằng bcrypt (salt 10 vòng), không lưu plaintext
- Trường `password` đặt `select: false` — không bao giờ trả về trong response
- `userId` lấy từ payload của JWT đã ký, **không bao giờ lấy từ request body hay URL** → chống IDOR
- Mọi truy vấn theo `:id` đều kèm `userId` trong cùng một câu query
- CORS chỉ cho phép domain frontend cụ thể, không dùng `*`
- Thông báo lỗi đăng nhập chung chung để tránh dò email tồn tại
- HTTPS mặc định trên cả Vercel và Render
# studyGoalTracker
