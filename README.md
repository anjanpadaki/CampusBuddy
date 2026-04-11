# CampusBuddy 🎓

A full-stack MERN campus event & teammate-finding platform with role-based access control.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (default: `mongodb://localhost:27017`)

### 1. Backend Setup
```bash
cd backend
npm install
node seedAdmin.js    # Creates admin account (run once)
npm run dev          # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Starts on http://localhost:3000
```

---



---

## 📁 Project Structure

```
CampusBuddy/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with embedded interests
│   │   └── Event.js         # Event schema
│   ├── middleware/
│   │   └── auth.js          # JWT auth + adminOnly middleware
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login
│   │   └── events.js        # All event endpoints
│   ├── server.js            # Express entry point
│   ├── seedAdmin.js         # Creates admin user
│   └── .env                 # MONGO_URI, JWT_SECRET, PORT
│
└── frontend/
    └── src/
        ├── api/axios.js          # Axios with auto JWT header
        ├── context/AuthContext   # Global auth state
        ├── components/
        │   ├── Navbar            # Sticky nav with role links
        │   ├── EventCard         # Event display card
        │   └── ProtectedRoute    # Role-based route guard
        └── pages/
            ├── LoginRegister     # Tabbed login/register
            ├── StudentDashboard  # Events + interest + team status
            ├── AdminDashboard    # Create/delete events
            └── FindTeammates     # Browse teammates per event
```

---

## ⚙️ API Reference

### Auth
| Method | Endpoint            | Access  | Description           |
|--------|--------------------|---------|-----------------------|
| POST   | /api/auth/register | Public  | Register student      |
| POST   | /api/auth/login    | Public  | Login (any role)      |

### Events
| Method | Endpoint                       | Access       | Description              |
|--------|-------------------------------|--------------|--------------------------|
| GET    | /api/events                   | Auth         | Upcoming events          |
| GET    | /api/events/all               | Admin only   | All events               |
| POST   | /api/events/create            | Admin only   | Create event             |
| DELETE | /api/events/:eventId          | Admin only   | Delete event             |
| GET    | /api/events/my-interests      | Auth         | My interests             |
| POST   | /api/events/interest/:eventId | Auth         | Toggle interest          |
| POST   | /api/events/team-status/:id   | Auth         | Update team status       |
| GET    | /api/events/teammates/:id     | Auth         | Get interested students  |

---

## 🔒 Security Features
- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT** tokens (7-day expiry) stored in localStorage
- Students **cannot register as admin** (role forced to `student`)
- All admin endpoints protected at backend level with `adminOnly` middleware
- Input validation on all APIs with **express-validator**

---

## 🎨 UI Features
- Dark theme design system with CSS variables
- Glassmorphism navbar with sticky positioning
- Animated background blobs on auth page
- Event cards with type badges, days-left indicator
- Admin stats dashboard with event table
- Find Teammates sidebar layout with status indicators
- Fully responsive (mobile-friendly)

---

## 🚀 DevSecOps & CI/CD

### 🐳 Docker & Docker Compose
To run the entire application using Docker Compose (Backend, Frontend, MongoDB):

1. Ensure Docker Desktop is running.
2. Run the compose file:
   ```bash
   docker-compose up --build
   ```
3. The frontend is accessible at `http://localhost:3000`
4. The backend is accessible at `http://localhost:5000`

### 🔁 CI Pipeline (GitHub Actions)
The project includes a robust Continuous Integration pipeline (`.github/workflows/ci.yml`) that triggers on push or pull requests to `main`.
- Validates Node.js execution for both Frontend and Backend
- Checks installations and tests the Frontend prod build
- **Security Validation:** Uses `Trivy` to check for CRITICAL and HIGH severity package vulnerabilities in the built Docker images.

### 🌐 CD Pipeline (Vercel)
Deploying the frontend React app to Vercel is seamless and enables automatic CD:

1. Push your code to your GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `CampusBuddy` GitHub repository.
4. **Important Configuration step:**
   - Change the "Framework Preset" to `Vite`.
   - Change the "Root Directory" to `frontend`.
5. **Environment Variables:**
   - Because of Vite's proxy, for production use a full backend URL.
   - Example (if your backend was deployed): Add `VITE_API_URL=https://campusbuddy-backend.herokuapp.com` (Note: requires updating axios config to use this var)
6. Click **Deploy**.

Vercel will now automatically rebuild and redeploy your frontend whenever you push to the `main` branch!
