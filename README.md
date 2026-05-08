# TaskFlow — Team Task Manager

A full-stack web application for managing projects, assigning tasks, and tracking progress with role-based access control (Admin/Member).

## 🚀 Live Demo
> Deploy to Railway and add your live URL here

## ✨ Features

### Authentication
- JWT-based Signup & Login
- Role-based access: **Admin** and **Member**
- Persistent sessions via localStorage

### Projects
- Admins can create, edit, and delete projects
- Add/remove team members per project
- Members only see projects they're part of

### Tasks
- Full CRUD for tasks (Admin only for create/edit/delete)
- Members can update **status** of tasks assigned to them
- Filters by status, priority, and project
- Overdue detection with visual highlighting

### Dashboard
- Live stats: To Do, In Progress, Done, Overdue
- Recent tasks overview
- Project progress bars

### Users
- Admin can view all registered users

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), React Router, Axios, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | LowDB (JSON-based, zero-config) |
| Auth | JWT + bcryptjs |
| Deployment | Railway |

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── db/          # Database setup (LowDB)
│   ├── middleware/  # JWT auth middleware
│   ├── routes/      # auth, projects, tasks, users
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # Sidebar
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Dashboard, Projects, Tasks, Users
│   │   ├── api.js       # Axios API layer
│   │   └── App.jsx
│   └── build/       # Production build
├── railway.toml     # Railway deployment config
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- npm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd team-task-manager

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Run Development

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 3. Build for Production

```bash
cd frontend && npm run build
cd ../backend && node server.js
# Visit http://localhost:5000
```

---

## 🚂 Deploy to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repository
4. Railway auto-detects `railway.toml` and builds + deploys
5. Set environment variable: `JWT_SECRET=your_secret_key_here`
6. Your app will be live at `https://your-app.railway.app`

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Projects
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/projects` | All users |
| POST | `/api/projects` | Admin |
| PUT | `/api/projects/:id` | Admin |
| DELETE | `/api/projects/:id` | Admin |
| POST | `/api/projects/:id/members` | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Admin |

### Tasks
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/tasks` | All users |
| POST | `/api/tasks` | Admin |
| PUT | `/api/tasks/:id` | Admin (full) / Member (status only) |
| DELETE | `/api/tasks/:id` | Admin |
| GET | `/api/tasks/dashboard/stats` | All users |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| GET | `/api/users/me` | All users |

---

## 👤 Test Accounts

Register via the app. For quick testing:

- Sign up as **Admin** to create projects, tasks, and manage members
- Sign up as **Member** to view assigned tasks and update their status

---

## 📝 Notes

- Database uses LowDB (JSON file) — zero setup required, data persists in `db.json`
- For production, consider migrating to PostgreSQL (Railway offers it free)
- JWT secret defaults to a hardcoded value; always set `JWT_SECRET` env var in production
