# 🚀 JobBoard — Django + React Full Stack App

---

## 🏗️ Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Backend   | Django 4.2 + Django REST Framework + JWT auth |
| Frontend  | React 18 + Vite + Tailwind CSS                 |
| Database  | SQLite (dev) / PostgreSQL (prod/Docker)        |
| Auth      | JWT (access + refresh tokens)                  |
| Deploy    | Docker + docker-compose + Nginx                |

---

## ✨ Features

- **Two user roles**: Job Seekers and Employers
- **Browse & search jobs** with filters (type, experience, location, category, remote)
- **Post jobs** with rich details (salary, skills, benefits, deadline)
- **Apply to jobs** with cover letter and portfolio URL
- **Employer dashboard** — manage listings, review applicants, update application status
- **Job seeker dashboard** — track all applications and statuses
- **Save/bookmark jobs**
- **JWT authentication** with auto token refresh
- **Admin panel** at `/admin`
- **Pagination, sorting, filtering** via DRF

---

## 🚀 Quick Start (Local Dev — No Docker)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Generate and run migrations
python manage.py makemigrations accounts
python manage.py makemigrations jobs
python manage.py migrate

# Seed demo data (creates demo users + sample jobs)
python manage.py seed_data

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🐳 Docker (Full Stack)

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`

---

## 👤 Demo Accounts

After running `seed_data`:

| Role       | Email                | Password   |
|------------|----------------------|------------|
| Employer   | employer@demo.com    | demo1234   |
| Job Seeker | seeker@demo.com      | demo1234   |
| Admin      | admin@demo.com       | admin1234  |

---

## 📡 API Endpoints

### Auth
| Method | URL                        | Description      |
|--------|----------------------------|------------------|
| POST   | `/api/auth/register/`      | Register         |
| POST   | `/api/auth/login/`         | Login (get JWT)  |
| POST   | `/api/auth/token/refresh/` | Refresh token    |
| GET    | `/api/auth/profile/`       | Get profile      |
| PATCH  | `/api/auth/profile/`       | Update profile   |

### Jobs
| Method | URL                             | Description            |
|--------|---------------------------------|------------------------|
| GET    | `/api/jobs/`                    | List jobs (filterable) |
| POST   | `/api/jobs/`                    | Create job (employer)  |
| GET    | `/api/jobs/<slug>/`             | Job detail             |
| PATCH  | `/api/jobs/<slug>/`             | Update job             |
| DELETE | `/api/jobs/<slug>/`             | Delete job             |
| GET    | `/api/jobs/categories/`         | List categories        |
| GET    | `/api/jobs/stats/`              | Site stats             |
| GET    | `/api/jobs/my-jobs/`            | Employer's jobs        |
| GET    | `/api/jobs/saved/`              | Saved jobs             |
| POST   | `/api/jobs/<slug>/save/`        | Toggle save            |
| GET    | `/api/jobs/<slug>/applications/`| Applicants for a job   |

### Applications
| Method | URL                                | Description         |
|--------|------------------------------------|---------------------|
| GET    | `/api/jobs/applications/all/`      | My applications     |
| POST   | `/api/jobs/applications/all/`      | Apply to a job      |
| PATCH  | `/api/jobs/applications/<id>/`     | Update status       |

### Query Params for Job Search
```
?search=react           # Full-text search
?job_type=full-time     # Job type filter
?experience_level=mid   # Experience level
?category=engineering   # Category slug
?location=San Francisco # Location filter
?is_remote=true         # Remote jobs only
?salary_min=80000       # Min salary
?ordering=-created_at   # Sort by newest
?page=2                 # Pagination
```

---

## ☁️ Cloud Deployment

### Render.com (Easiest)
1. Push to GitHub
2. Create a new **Web Service** for backend (Python), point to `/backend`
3. Set env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, DB vars
4. Create a new **Static Site** for frontend, build command: `npm run build`, publish dir: `dist`
5. Set `VITE_API_URL` to your backend URL

### Railway
```bash
railway init
railway add postgresql
railway up
```

### AWS / GCP / DigitalOcean
Use the `docker-compose.yml` as-is on any VPS with Docker installed.

---

## 📁 Project Structure

```
jobboard/
├── backend/
│   ├── accounts/         # User auth, profiles
│   ├── jobs/             # Jobs, applications, saved jobs
│   │   └── management/commands/seed_data.py
│   ├── jobboard/         # Django settings, urls, wsgi
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API client
│   │   ├── components/   # Navbar, JobCard
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # All page components
│   │   └── utils/        # Helpers, formatters
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
└── docker-compose.yml
```
