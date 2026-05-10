# TaskFlow — Team Task Manager

A full-stack web application to manage projects, assign tasks, and track progress with **Role-Based Access Control (Admin/Member)**.

Built as part of the **Ethara.AI Campus Placement Assignment** — B.Tech CSE 2026 Batch.

---

## 🚀 Live Demo

🔗 **[https://team-task-manager-production-7419.up.railway.app](https://team-task-manager-production-7419.up.railway.app)**

---

## ✨ Features

### 🔐 Authentication

- JWT-based Signup & Login
- Role selection: **Admin** or **Member**
- Persistent session via localStorage

### 📁 Projects (Admin Only)

- Create, Edit, Delete projects
- Add / Remove team members per project
- Members only see their assigned projects

### ✅ Tasks

- Admin: Full CRUD — Create, Edit, Delete, Assign tasks
- Member: Update status of their own assigned tasks
- Filter by Status, Priority, Project
- Overdue task detection with visual highlight 🔥

### 📊 Dashboard

- Live stats: To Do, In Progress, Done, Overdue
- Recent tasks overview
- Project progress bars

### 👥 Users (Admin Only)

- View all registered users with roles

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, Vite, Axios, Lucide Icons |
| Backend    | Node.js, Express.js                 |
| Database   | LowDB (JSON file — zero config)     |
| Auth       | JWT + bcryptjs                      |
| Deployment | Railway                             |

---

## 📁 Folder Structure

```
team-task-manager/
├── backend/
│   ├── db/
│   │   └── database.js        # LowDB setup
│   ├── middleware/
│   │   └── auth.js            # JWT middleware + role check
│   ├── routes/
│   │   ├── auth.js            # Signup / Login
│   │   ├── projects.js        # Project CRUD + members
│   │   ├── tasks.js           # Task CRUD + dashboard stats
│   │   └── users.js           # User listing
│   ├── server.js              # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
├── railway.toml
├── .gitignore
└── README.md
```

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

MIT License — Free to use and modify.
