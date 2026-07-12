# ShreeNova Tech — Node.js Backend

Complete REST API backend built with Node.js + Express + JWT + MySQL.

## Stack
- **Node.js** + **Express.js**
- **JWT Authentication** (jsonwebtoken)
- **MySQL** (mysql2 with connection pool)
- **Multer** (file uploads)
- **Nodemailer** (email)
- **bcryptjs** (password hashing)
- **dotenv** (environment config)
- **Morgan** (HTTP logging)
- **Helmet** (security headers)
- **CORS** (cross-origin)
- **express-rate-limit** (rate limiting)

---

## Project Structure

```
shreenovatech/
├── src/                    ← React frontend
├── backend/                ← PHP backend (XAMPP)
│   ├── admin/              ← Admin HTML panel
│   ├── api/                ← PHP API entry
│   ├── config/             ← DB config + schema.sql
│   ├── controllers/        ← PHP controllers
│   ├── helpers/            ← JWT + functions
│   └── uploads/            ← PHP upload storage
├── node-backend/           ← Node.js backend (THIS)
│   ├── src/
│   │   ├── config/         ← db.js, jwt.js, multer.js
│   │   ├── controllers/    ← All API controllers
│   │   ├── middleware/     ← auth.js, helpers.js
│   │   ├── routes/         ← All route files
│   │   └── server.js       ← Express entry point
│   ├── uploads/            ← Node upload storage
│   ├── .env                ← Environment variables
│   └── package.json
└── public/                 ← Static assets
```

---

## Setup

### 1. Install dependencies
```bash
cd node-backend
npm install
```

### 2. Configure .env
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=shreenovatech_db
JWT_SECRET=SNT_JWT_SECRET_KEY_2024_SHREENOVATECH
JWT_EXPIRES_IN=24h
BASE_URL=http://localhost:5000
```

### 3. Setup Database
Import the schema from `backend/config/schema.sql` into MySQL:
```bash
mysql -u root -p < backend/config/schema.sql
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

### 5. Switch frontend to Node.js backend
Add to root `.env`:
```env
USE_NODE_BACKEND=true
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | ❌ | Admin login |
| POST | `/auth/logout` | ✅ | Admin logout |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/change-password` | ✅ | Change password |
| POST | `/auth/forgot` | ❌ | Forgot password |
| POST | `/auth/reset` | ❌ | Reset password |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | ✅ | Full dashboard stats |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings` | ✅ | List all (search, filter, paginate) |
| GET | `/bookings/:id` | ✅ | Get single booking |
| POST | `/bookings` | ❌ | Submit new booking |
| PUT | `/bookings/:id/status` | ✅ | Update status |
| PUT | `/bookings/:id` | ✅ | Update notes |
| DELETE | `/bookings/:id` | ✅ | Delete booking |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/payments` | ✅ | List all (filter by status/package) |
| GET | `/payments/:id` | ✅ | Get single payment |
| POST | `/payments` | ❌ | Submit payment + screenshot upload |
| PUT | `/payments/:id/status` | ✅ | Approve/Reject |
| DELETE | `/payments/:id` | ✅ | Delete payment |

### Contacts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/contact` | ✅ | List all messages |
| GET | `/contact/:id` | ✅ | View message (marks as read) |
| POST | `/contact` | ❌ | Submit contact form |
| PUT | `/contact/:id/reply` | ✅ | Reply to message |
| PUT | `/contact/:id` | ✅ | Update status |
| DELETE | `/contact/:id` | ✅ | Delete message |

### Portfolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/portfolio` | ❌ | List projects |
| GET | `/portfolio/:id` | ❌ | Get project |
| POST | `/portfolio` | ✅ | Add project + image upload |
| PUT | `/portfolio/:id` | ✅ | Edit project |
| DELETE | `/portfolio/:id` | ✅ | Delete project |

### Pricing
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/pricing` | ❌ | List plans (Silver/Golden/Diamond) |
| GET | `/pricing/:id` | ❌ | Get plan |
| POST | `/pricing` | ✅ | Create plan |
| PUT | `/pricing/:id` | ✅ | Update plan |
| DELETE | `/pricing/:id` | ✅ | Delete plan |

### Settings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/settings` | ❌ | Get all settings |
| PUT | `/settings` | ✅ | Update settings |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | ✅ admin | List admin users |
| POST | `/users` | ✅ super_admin | Create user |
| PUT | `/users/:id` | ✅ admin | Update user |
| DELETE | `/users/:id` | ✅ super_admin | Delete user |

### Analytics / Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats` | ❌ | Site stats |
| PUT | `/stats/:id` | ✅ | Update stat |
| GET | `/stats/visitors` | ✅ | Visitor analytics |
| POST | `/stats/track` | ❌ | Track page visit |

### Hosting
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/hosting` | ❌ | List hosting plans |
| POST | `/hosting` | ✅ | Create plan |
| PUT | `/hosting/:id` | ✅ | Update plan |
| DELETE | `/hosting/:id` | ✅ | Delete plan |

---

## Admin Panel

The admin panel is at `/admin` → redirects to `backend/admin/login.html`

Default credentials:
- Email: `admin@shreenovatech.in`
- Password: `password`

---

## Default Login

```
Email:    admin@shreenovatech.in
Password: password
```

> Change the password immediately after first login via Settings → Users.
