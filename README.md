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
