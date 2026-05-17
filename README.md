# JobBoard Application Stack

This repository houses the core application services for **JobBoard**, a production-grade full-stack platform connecting job seekers and employers. The platform is engineered with a decoupled architecture, strict authentication patterns, and built-in cloud-native telemetry.

## 🛠️ Technology Stack

- **Frontend:** React (SPA)
- **Backend:** Django / Django REST Framework (DRF)
- **Database:** PostgreSQL (PL/SQL / Relational)
- **Authentication:** JWT (JSON Web Tokens via `rest_framework_simplejwt`)
- **Telemetry & Metrics:** `django-prometheus` (Exposing `/metrics` for Prometheus scraping)

---

## 🏗️ Core Architecture Overview

### 1. Django Backend & API Layer

The backend is built using **Django REST Framework (DRF)** to expose high-performance, stateless REST APIs. It handles the core business logic, relational data modeling, query optimization, and structured JWT token issuance/rotation.

### 2. React Frontend Layer

A modern **React Single Page Application (SPA)** that handles consumer state, client-side routing, and interactive forms for users and employers. It communicates asynchronously with the Django backend using secure HTTP client layers, managing session lifespan via short-lived JWT tokens.

### 3. PostgreSQL Database

A robust relational database layer utilizing **PostgreSQL**. The database handles structured mapping for complex multi-table operations (such as linking Users, Job Profiles, Applications, and Saved Job States) utilizing relational constraints, foreign keys, and indexes for performant lookups.

---

## 🗺️ API Route Mapping

All endpoints are strictly versioned or grouped behind structural prefixes. Below is the full system routing matrix configured in the application:

### 🔐 Authentication Module (`/api/auth/`)

Handles user identity management, registration workflows, and token validation lifecycles.

| Endpoint                     | Method    | Description                                                       |
| :--------------------------- | :-------- | :---------------------------------------------------------------- |
| `/api/auth/register/`        | `POST`    | Register a new user or employer account                           |
| `/api/auth/login/`           | `POST`    | Authenticate credentials & return access/refresh JWT tokens       |
| `/api/auth/token/refresh/`   | `POST`    | Exchange a valid refresh token for a new short-lived access token |
| `/api/auth/profile/`         | `GET/PUT` | Retrieve or update current authenticated user profile data        |
| `/api/auth/change-password/` | `POST`    | Securely update authenticated user password                       |

### 💼 Job & Application Module (`/api/jobs/`)

Manages job board postings, analytics, categorization, and the underlying recruitment state machines.

| Endpoint                              | Method        | Description                                                          |
| :------------------------------------ | :------------ | :------------------------------------------------------------------- |
| `/api/jobs/`                          | `GET/POST`    | List all open jobs (with filters) or create a new job posting        |
| `/api/jobs/stats/`                    | `GET`         | Retrieve aggregate metrics and data dashboards for job analytics     |
| `/api/jobs/categories/`               | `GET`         | List available industry categories for job classifications           |
| `/api/jobs/my-jobs/`                  | `GET`         | List jobs posted by or relevant to the current authenticated user    |
| `/api/jobs/saved/`                    | `GET`         | Fetch the authenticated candidate's list of bookmarked/saved jobs    |
| `/api/jobs/<slug:slug>/`              | `GET/PUT/DEL` | View detail, modify, or remove a specific job using its unique slug  |
| `/api/jobs/<slug:slug>/applications/` | `GET`         | View all candidate applications submitted for a specific job posting |
| `/api/jobs/<slug:slug>/save/`         | `POST`        | Toggle the save/bookmark state for a specific job posting            |
| `/api/jobs/applications/all/`         | `GET/POST`    | Global view of applications or submit a new application packet       |
| `/api/jobs/applications/<int:pk>/`    | `GET/PATCH`   | Retrieve details or modify the state of a specific application by ID |

### 🛠️ Core Operations, Storage & Admin

| Endpoint      | Protocol / Mechanism | Description                                                                   |
| :------------ | :------------------- | :---------------------------------------------------------------------------- |
| `/admin/`     | HTTP                 | Built-in Django administrative portal for data management                     |
| `/metrics`    | HTTP (Prometheus)    | Live application performance metrics exported via `django-prometheus`         |
| `/api/health` | HTTP                 | Lightweight health-check endpoint for ALB / ECS container target group probes |
| `MEDIA_URL`   | Static File Storage  | Configured route for serving user-uploaded static media files (e.g., Resumes) |
