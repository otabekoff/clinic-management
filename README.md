# 🏥 Clinic Management System (Backend API)

A real-life backend API for a clinic system built with **Node.js (Express)** and **PostgreSQL (pg)**.

## 🎯 Goal

Students must build a backend API that focuses on:

* 🔐 **Authentication** using JWT
* 🛂 **Role-based authorization**
* 🧠 **Correct business logic** (including ownership checks)

---

## 👥 Roles

* 🟢 **Admin**
* 🔵 **Doctor**
* 🟡 **Patient**

---

## 🗄 Database Design (Required Tables)

### `users`

All users live in a single table because authentication is shared.

Columns:

* `id`
* `name`
* `email`
* `password`
* `role` (`admin | doctor | patient`)

### `doctor_profiles`

Extra info for doctors only.

Columns:

* `id`
* `user_id` (FK → `users.id`)
* `specialization`
* `working_hours`

### `patient_profiles`

Extra info for patients only.

Columns:

* `id`
* `user_id` (FK → `users.id`)
* `phone`
* `date_of_birth`

### `appointments`

Appointments connect doctors and patients (both are users).

Columns:

* `id`
* `doctor_id` (FK → `users.id`)
* `patient_id` (FK → `users.id`)
* `appointment_date`
* `status` (`pending | approved | cancelled`)

---

## 🔐 Access Rules (Authorization Matrix)

| Action                |   Admin |       Doctor |                  Patient |
| --------------------- | ------: | -----------: | -----------------------: |
| View all users        |       ✅ |            ❌ |                        ❌ |
| Create doctor         |       ✅ |            ❌ |                        ❌ |
| Create appointment    |       ❌ |            ❌ |                        ✅ |
| Approve appointment   |       ❌ | ✅ (own only) |                        ❌ |
| Cancel appointment    | ✅ (any) | ✅ (own only) | ✅ (own, if not approved) |
| View all appointments |       ✅ |            ❌ |                        ❌ |
| View own appointments |       ❌ |            ✅ |                        ✅ |

🚫 Unauthorized access must return **HTTP 403**.

---

## 🧩 Authorization Logic Rules

* 🧱 **Authentication and role checks must be middleware**
* 🔎 **Ownership checks must be inside controller logic**

  * Compare `req.user.id` with appointment’s `doctor_id` or `patient_id`

---

## 🛠 Tech Stack

* **Node.js + Express**
* **PostgreSQL**
* **pg** (no Prisma)
* **JWT** auth
* **bcrypt** password hashing

---

## 📦 Installed Packages

Runtime (main):

* `express` — web server
* `pg` — Postgres driver
* `dotenv` — environment variables
* `jsonwebtoken` — JWT sign/verify
* `bcrypt` — password hashing
* `express-validator` — request validation

Recommended (security/logging):

* `helmet` — secure HTTP headers
* `cors` — enable cross-origin requests
* `morgan` — request logs

Dev:

* `nodemon` — auto restart in development

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Create `.env`

Example:
```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/clinic_db
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=7d
```

### 3) Setup DB + migrations

* Put migration SQL files into: `src/migrations/`
* Run them using `psql` or a migration tool (future improvement section below)

Example manual run:
```bash
psql "$DATABASE_URL" -f src/migrations/001_init.sql
```

### 4) Run the server

```bash
npm run dev
```

---

## 🧱 Project Structure

This project is **modular + feature-based**:

* Everything is organized by **modules/features** (auth, doctors, appointments, etc.)
* Each module owns its own routes, controller, repo, validation, and rules.

---

## 📁 Folder & File Explanation (Everything in this repo)

### Root

#### `.env`

Environment variables (NOT committed in real projects).
Contains DB connection string and JWT secret.

#### `package.json`

Dependencies and scripts.

#### `package-lock.json`

Locked dependency versions.

#### `README.md`

Project documentation (this file).

---

## `src/` — Application source code

### `src/app/` — App bootstrapping (Express entry and global wiring)

#### `app.js`

Creates the Express app and registers global middlewares:

* `express.json()`
* security middlewares (helmet/cors)
* logging middleware (morgan)
* main router mounting

#### `routes.js`

A single file that mounts all module routers:

* `/auth` → auth routes
* `/admin/users` → users routes
* `/admin/doctors` → doctors routes
* `/appointments` → appointment routes
* etc.

#### `errors.js`

Centralized error utilities:

* `HttpError` class (status + message)
* global `errorHandler` middleware (consistent error response)

#### `server.js`

Starts the server:

* imports the app
* calls `app.listen(PORT)`

---

### `src/shared/` — Shared utilities used by all modules

#### `shared/config/env.js`

Loads and validates required environment variables.
This prevents “undefined config” bugs.

#### `shared/db/pool.js`

Creates and exports a single `pg.Pool` instance.
All modules use it for DB queries.

#### `shared/lib/jwt.js`

JWT helper functions:

* `signToken(payload)`
* `verifyToken(token)`

#### `shared/lib/password.js`

Password helper functions:

* `hashPassword(plain)`
* `comparePassword(plain, hash)`

#### `shared/middlewares/auth.js`

Authentication middleware:

* Reads `Authorization: Bearer <token>`
* Verifies token
* Sets `req.user = { id, role, email, ... }`
  If token is missing/invalid → returns 401.

#### `shared/middlewares/requireRole.js`

Role authorization middleware:

* Example: `requireRole('admin')`
* Example: `requireRole(['doctor','admin'])`
  If role not allowed → returns **403**.

---

### `src/modules/` — Feature modules (main work happens here)

Each module is a “mini app”:

* `*.routes.js` = Express routes + middlewares
* `*.controller.js` = request handlers + business logic + ownership checks
* `*.repo.js` = DB queries (SQL) using pg pool
* `*.validators.js` = express-validator schemas
* `*.rules.js` (optional) = helper functions for complex rules

---

## Modules

### `modules/auth/` — Login & registration (JWT)

* `auth.routes.js`: `/auth/*` endpoints
* `auth.controller.js`: login/register handlers
* `auth.repo.js`: DB queries on `users` (find user by email, create user, etc.)
* `auth.validators.js`: validate login/register input

Typical endpoints:

* `POST /auth/login`
* `POST /auth/register-patient` (or admin creates users depending on requirements)

---

### `modules/users/` — Admin-only user listing

* `users.routes.js`: protected routes (admin only)
* `users.controller.js`: handler logic
* `users.repo.js`: queries for listing users

Main endpoint:

* `GET /admin/users` ✅ admin only

---

### `modules/doctors/` — Admin creates doctors + doctor_profiles

* `doctors.routes.js`: admin-only routes
* `doctors.controller.js`: creates doctor user + doctor profile
* `doctors.repo.js`: DB queries for `users` + `doctor_profiles`
* `doctors.validators.js`: validates doctor creation payload

Main endpoint:

* `POST /admin/doctors` ✅ admin only

---

### `modules/patients/` — Patient profile (optional now, useful later)

* `patients.routes.js`
* `patients.controller.js`
* `patients.repo.js`

Can later include:

* get/update patient profile
* admin view patient details

---

### `modules/appointments/` — Create/approve/cancel appointments

* `appointments.routes.js`: protects endpoints by role
* `appointments.controller.js`: business rules + ownership checks
* `appointments.repo.js`: SQL queries for appointments
* `appointments.validators.js`: validates appointment input
* `appointments.rules.js`: helper functions:

  * “can patient cancel?”
  * “is appointment owned by doctor/patient?”

Main endpoints:

* `POST /appointments` (patient only)
* `PATCH /appointments/:id/approve` (doctor only + own appointment)
* `PATCH /appointments/:id/cancel`

  * admin: any
  * doctor: own
  * patient: own AND not approved
* `GET /admin/appointments` (admin only: all)
* `GET /appointments/me` (doctor/patient: own)

---

### `src/migrations/`

Database schema scripts (SQL).

* Currently empty folder: add `001_init.sql` and next migration files.

---

## ✅ Team Workflow (How teammates should work)

### 1) One module = one owner

Assign features to teammates:

* Teammate A: `auth/`
* Teammate B: `doctors/ + users/`
* Teammate C: `appointments/`
* Teammate D: `migrations/ + seed data + docs/tests`

Each teammate works only inside their module and touches `shared/` only if needed.

### 2) Branching rules

* Create feature branches:

  * `feature/auth-login`
  * `feature/appointments-approve`
  * `feature/admin-create-doctor`
* Open PRs into `main`
* Require at least 1 review

### 3) Coding rules (consistency)

* Controllers must:

  * validate input
  * call repo functions
  * enforce ownership rules (doctor_id/patient_id checks)
  * return proper status codes and JSON
* Repos must:

  * contain SQL only
  * return rows
  * not contain express logic (`req/res`)
* Middleware must:

  * do auth/role checks only
  * return 401/403 consistently

### 4) Status codes standard

* 200 OK
* 201 Created
* 400 Bad Request (validation)
* 401 Unauthorized (no/invalid token)
* 403 Forbidden (role not allowed / access denied)
* 404 Not Found (missing resource)
* 409 Conflict (email already exists, etc.)
* 500 Server Error

---

## 🧩 What is Missing (Future Work)

### Must add soon

* ✅ `src/migrations/001_init.sql` (tables + constraints)
* ✅ Seed script (create initial admin user)
* ✅ Input validations for all endpoints (appointments date/status)
* ✅ Consistent error response format (if not implemented fully yet)

### Highly recommended next

* Transaction handling:

  * Creating doctor requires inserting into `users` + `doctor_profiles` safely
  * Use SQL transactions to avoid partial writes

* Appointment listing endpoints:

  * Admin: paginate + filter by status/date
  * Doctor/patient: own appointments + pagination

* Testing:

  * Auth tests
  * Role checks tests (403)
  * Ownership tests (doctor can approve only own)
  * Appointment cancel rules

* Rate limiting (security)

* Logging improvements

* API documentation (Swagger/OpenAPI)

---

## 📌 Developer Notes (Important)

### Ownership check rule (mandatory)

Role middleware alone is NOT enough.

Example:

* Doctor trying to approve appointment:

  * Must be role `doctor`
  * Must match appointment doctor_id

If not matched → return **403**.

### Single users table rule

All accounts must be in `users`.
Profiles are optional tables based on role.

---

## ✅ Expected Deliverables (Student Checklist)

* [ ] Postgres schema implemented (`users`, `doctor_profiles`, `patient_profiles`, `appointments`)
* [ ] JWT login
* [ ] Middleware auth
* [ ] Middleware role check with 403
* [ ] Ownership checks inside controllers
* [ ] Appointments rules implemented exactly as requirement table
* [ ] README updated if endpoints change
