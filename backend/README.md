# CE Website Backend

Express + MySQL API that serves dynamic content to the React frontend.

## 1) Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Update `.env` with your MySQL credentials.

3. Create schema and seed data:

```bash
npm run db:setup
```

Optional granular commands:

```bash
npm run db:schema
npm run db:seed
```

4. Install dependencies:

```bash
npm install
```

5. Start server:

```bash
npm run dev
```

API will run at `http://localhost:4000` by default.

## 2) Public API

- `GET /api/health`
- `GET /api/public/bootstrap`
- `GET /api/public/home`

## 3) Admin Authentication

Authentication is session-based with username/password login.

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/auth/session`

On successful login, backend sets a secure HTTP-only cookie for admin access.
The default admin user is auto-created at startup from `ADMIN_DEFAULT_USERNAME` and `ADMIN_DEFAULT_PASSWORD` in `.env`.

## 4) Admin API

All endpoints below require an authenticated admin session:

- `GET /api/admin/content`
- `POST /api/admin/uploads/image` (multipart form-data, field name: `image`)
- `PUT /api/admin/site-settings`
- `POST/PATCH/DELETE /api/admin/navigation-items`
- `POST/PATCH/DELETE /api/admin/social-links`
- `POST/PATCH/DELETE /api/admin/footer-links`
- `PUT /api/admin/home-content`
- `POST/PATCH/DELETE /api/admin/home/hero-slides`
- `POST/PATCH/DELETE /api/admin/home/stats`
- `POST/PATCH/DELETE /api/admin/news`

## 5) Next Migration Targets

After this first slice, move these domains to API similarly:
- About page sections
- Academics programs and curriculum
- People (faculty/staff/students)
- Specializations, labs, and equipment
- Events and contact submissions
