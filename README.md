# NestJS Backend Base

Project base **NestJS + TypeScript + Validation + Swagger + MongoDB**, chuẩn cho REST API.

---

## 1️⃣ Yêu cầu

* Node.js >= 18
* npm >= 9
* MongoDB (local hoặc container)
* Mongo Compass (tùy chọn để quản lý DB)

---

## 2️⃣ Cài đặt

1. Clone project hoặc tạo project mới bằng Nest CLI:

```bash
nest new backend
cd backend
```

2. Cài các package cần thiết:

```bash
npm install @nestjs/mongoose mongoose @nestjs/config
npm install class-validator class-transformer @nestjs/swagger swagger-ui-express helmet cors
npm install --save-dev @types/node nodemon
```

3. Tạo file `.env` (copy từ `.env.example`):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/nestjs_db
```

---

## 3️⃣ Cấu trúc thư mục

```
backend/
├── src/
│   ├── main.ts                # Entry point
│   ├── app.module.ts          # Root module
│   ├── common/                # Filters, Guards, Interceptors, Pipes
│   ├── config/
│   │   └── swagger.config.ts  # Swagger setup
│   └── modules/
│       └── users/
│           ├── users.module.ts
│           ├── users.controller.ts
│           ├── users.service.ts
│           ├── dto/
│           │   └── create-user.dto.ts
│           └── entities/
│               └── user.entity.ts
├── package.json
├── tsconfig.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 4️⃣ Chạy project

* **Chạy dev mode**:

```bash
npm run start:dev
```

* **Chạy production**:

```bash
npm run build
npm run start:prod
```

* **Truy cập API**: `http://localhost:3000/api`
* **Swagger docs**: `http://localhost:3000/api/docs`

---

## 5️⃣ MongoDB & Mongo Compass

* Kết nối Mongo Compass tới:

```
MONGO_URI=mongodb+srv://loan:21112003loanhoang@cluster0.1sdjxcz.mongodb.net/DATN?retryWrites=true&w=majority&appName=Cluster0
```

* Collection `users` sẽ được tạo tự động khi tạo dữ liệu qua API.

---

## 6️⃣ Notes

* **Validation**: sử dụng `class-validator` + `ValidationPipe`
* **Swagger**: tự động sinh docs từ DTO
* **Security**: `helmet`, `cors` đã enable
* **Modules**: tạo module mới theo `nest g module modules/<module-name>`
* **Env variables**: tất cả config quan trọng đều nằm trong `.env`

---

## 7️⃣ Docker (tùy chọn)

* Build & chạy project + MongoDB:

```bash
docker-compose up --build
```

* API vẫn truy cập: `http://localhost:3000/api`
* Swagger: `http://localhost:3000/api/docs`
