# Equipment Loans & Reservations – Full-Stack Starter

This is a full-stack starter template for managing institutional equipment loans and reservations.

- **Frontend:** React + Vite + Tailwind CSS + Axios
- **Backend:** Flask (Python) + SQLAlchemy + JWT auth + CORS
- **Database:** MySQL

It supports:

- User roles: **admin**, **teacher**, **student**
- CRUD for **users** and **equipments**
- Loan management with equipment states: **available**, **loaned**, **under_maintenance**
- RESTful API under `/api/*` consumed by the React frontend

---

## Project Structure

```text
backend/
  app.py
  __init__.py
  config.py
  requirements.txt
  .env.example
  models/
    __init__.py
    user.py
    equipment.py
    loan.py
    alert.py
  controllers/
    __init__.py
    auth_controller.py
    user_controller.py
    equipment_controller.py
    loan_controller.py
  routes/
    __init__.py
    auth_routes.py
    user_routes.py
    equipment_routes.py
    loan_routes.py

frontend/
  package.json
  vite.config.js
  postcss.config.cjs
  tailwind.config.cjs
  index.html
  src/
    main.jsx
    App.jsx
    index.css
    components/
      Layout.jsx
      Navbar.jsx
      Sidebar.jsx
      EquipmentCard.jsx
    context/
      AuthContext.jsx
    services/
      api.js
    pages/
      Home.jsx
      Login.jsx
      Dashboard.jsx
      EquipmentList.jsx
      LoanRequests.jsx
```

---

## Backend Setup (Flask + MySQL)

### 1. Create and configure the database

Create a MySQL database (e.g. `equipment_loans`) and a user with permissions.

```sql
CREATE DATABASE equipment_loans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure environment variables

Copy the example env file and edit it:

```bash
cd backend
copy .env.example .env   # On PowerShell/cmd (Windows)
# or
cp .env.example .env     # On Git Bash / WSL
```

Edit `.env` with your MySQL credentials:

```env
SECRET_KEY=change-me
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=equipment_loans
CORS_ORIGINS=http://localhost:5173
FLASK_ENV=development
FLASK_APP=backend.app
```

### 3. Install Python dependencies

Create a virtual environment (recommended) and install requirements:

```bash
cd backend
python -m venv venv
# Activate venv (PowerShell)
./venv/Scripts/Activate.ps1

pip install -r requirements.txt
```

### 4. Create database tables

With the virtual environment active and `.env` configured:

```bash
cd backend
flask create-db
```

This uses SQLAlchemy models in `backend/models/*` to create the `users`, `equipments`, `loans`, and `alerts` tables.

### 5. Run the Flask backend

```bash
cd backend
flask run
```

By default the API will be available at `http://127.0.0.1:5000/api/*`.

Key endpoints:

- `POST /api/auth/register` – register a new user (e.g. initial admin)
- `POST /api/auth/login` – login, returns JWT and user info
- `GET /api/users` – list users (admin only)
- `POST /api/users` – create user (admin)
- `GET /api/equipments` – list equipments (all roles)
- `POST /api/equipments` – create equipment (admin)
- `GET /api/loans` – list loans (admin/teacher/student)
- `POST /api/loans` – create loan (admin/teacher)
- `POST /api/loans/<id>/close` – close/return loan (admin/teacher)

JWT is expected in the `Authorization: Bearer <token>` header.

---

## Frontend Setup (React + Vite + Tailwind)

### 1. Install Node dependencies

You need **Node.js** and **npm** installed. Then:

```bash
cd frontend
npm install
```

### 2. Run the frontend

```bash
cd frontend
npm run dev
```

Vite will start the dev server (by default on `http://localhost:5173`). The Vite dev server is configured to proxy `/api` calls to the Flask backend at `http://127.0.0.1:5000`.

---

## Frontend Architecture

- **Routing:** `react-router-dom` in `src/App.jsx` with pages:
  - `/` → `Home` (landing page)
  - `/login` → `Login` (auth)
  - `/dashboard` → `Dashboard` (secured)
  - `/equipments` → `EquipmentList` (secured)
  - `/loans` → `LoanRequests` (secured for admin/teacher)
- **Auth Context:** `src/context/AuthContext.jsx` holds the logged in user and JWT, persisted in `localStorage`.
- **API Layer:** `src/services/api.js` exposes an Axios client pointing to `/api` and injects the `Authorization` header when a token is present.
- **Layout & UI:** `Layout`, `Navbar`, `Sidebar`, `EquipmentCard` use Tailwind CSS classes for a responsive, modern design.

### Authentication Flow

1. User submits email/password on `/login`.
2. Frontend sends `POST /api/auth/login`.
3. Backend validates credentials and returns `{ token, user }`.
4. `AuthContext` stores them and persists in `localStorage`.
5. Protected routes use a `PrivateRoute` wrapper to redirect unauthenticated users to `/login` and enforce allowed roles.

---

## Backend Architecture

- **App factory:** `backend/__init__.py` exposes `create_app`, configures SQLAlchemy, CORS, and registers blueprints.
- **Config:** `backend/config.py` loads environment variables via `python-dotenv` and builds the MySQL URI.
- **Models:**
  - `User` – `users(id, name, email, password, role, created_at)`
  - `Equipment` – `equipments(id, name, type, status, description, created_at)`
  - `Loan` – `loans(id, user_id, equipment_id, loan_date, return_date, status)`
  - `Alert` – `alerts(id, loan_id, alert_type, date)`
- **Controllers:** Pure business logic for auth, users, equipments, and loans.
- **Routes (Blueprints):** Thin HTTP layer exposing RESTful endpoints under `/api/*`.
- **Auth:** JWT-based, with role checks via `@token_required(roles=[...])` decorator.

### Equipment & Loan States

- Equipment `status` (in `equipments` table):
  - `available` – ready to be loaned
  - `loaned` – currently on loan
  - `under_maintenance` – temporarily unavailable
- Loan `status` (in `loans` table):
  - `active` – currently loaned
  - `returned` – returned, equipment reset back to `available`
  - `cancelled` – (reserved for future use)

Creating a loan sets the equipment to `loaned`; closing a loan sets the equipment back to `available`.

---

## Running the Stack Locally

1. **Backend**
   - Configure `.env` in `backend/`.
   - Create venv and install dependencies: `pip install -r requirements.txt`.
   - Create tables: `flask create-db`.
   - Run API: `flask run`.

2. **Frontend**
   - Install dependencies: `npm install` in `frontend/`.
   - Run dev server: `npm run dev`.

Access the app at: `http://localhost:5173`.

---

## Notes for Production Deployment

- Configure proper environment variables for database credentials and `SECRET_KEY`.
- Use a production-ready WSGI server for Flask (e.g. gunicorn or uWSGI) behind a reverse proxy.
- Build the frontend (`npm run build`) and serve the static files via your web server (or host separately).
- Lock dependencies using `requirements.txt` and `package-lock.json`.
- Add proper HTTPS, logging, and monitoring in your deployment environment.
