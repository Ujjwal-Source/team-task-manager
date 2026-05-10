---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- npm

### 1. Clone the repo
```bash
git clone https://github.com/Ujjwal-Source/team-task-manager.git
cd team-task-manager
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Run the app

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd backend
node server.js
# ✅ Running on http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
# ✅ Open http://localhost:5173
```

---

## 🚂 Deployed on Railway

Live URL: **[https://team-task-manager-production-7419.up.railway.app](https://team-task-manager-production-7419.up.railway.app)**

### Deploy Steps (for reference)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → Login with GitHub
3. New Project → Deploy from GitHub repo
4. Add environment variable: `JWT_SECRET = your_secret_key`
5. Settings → Domains → Generate Domain ✅

---

## 🔐 API Endpoints

### Auth

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | `/api/auth/signup` | Register new user     |
| POST   | `/api/auth/login`  | Login & get JWT token |

### Projects

| Method | Endpoint                            | Access     |
| ------ | ----------------------------------- | ---------- |
| GET    | `/api/projects`                     | All users  |
| POST   | `/api/projects`                     | Admin only |
| PUT    | `/api/projects/:id`                 | Admin only |
| DELETE | `/api/projects/:id`                 | Admin only |
| POST   | `/api/projects/:id/members`         | Admin only |
| DELETE | `/api/projects/:id/members/:userId` | Admin only |

### Tasks

| Method | Endpoint                     | Access                              |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | `/api/tasks`                 | All users                           |
| POST   | `/api/tasks`                 | Admin only                          |
| PUT    | `/api/tasks/:id`             | Admin (full) / Member (status only) |
| DELETE | `/api/tasks/:id`             | Admin only                          |
| GET    | `/api/tasks/dashboard/stats` | All users                           |

### Users

| Method | Endpoint        | Access     |
| ------ | --------------- | ---------- |
| GET    | `/api/users`    | Admin only |
| GET    | `/api/users/me` | All users  |

---

## 👤 Role-Based Access Control

| Feature              | Admin | Member              |
| -------------------- | ----- | ------------------- |
| Create Project       | ✅    | ❌                  |
| Add / Remove Members | ✅    | ❌                  |
| Create Task          | ✅    | ❌                  |
| Assign Task          | ✅    | ❌                  |
| Update Task Status   | ✅    | ✅ (own tasks only) |
| View Dashboard       | ✅    | ✅                  |
| View All Users       | ✅    | ❌                  |

---

## 🧪 Quick Test Guide

1. **Admin** → Sign up as Admin → Create project → Add member → Create & assign task
2. **Member** → Sign up as Member → See assigned tasks → Update status to Done
3. **Dashboard** → Stats update in real time

---

## 👨‍💻 Author

**Ujjwal**
B.Tech CSE 2026
Maharishi Markandeshwar Deemed to be University, Mullana

---

## 📄 License

MIT License — Free to use and modify
