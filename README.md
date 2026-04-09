# 📊 AI-Powered Data Analyzer

A full-stack web application that lets authenticated users upload a CSV file, visualise the data through interactive charts and KPI cards, and receive AI-generated business insights powered by Google Gemini.

---

## 🚀 Live Features

- 🔐 **JWT Authentication** — Secure register / login with bcrypt-hashed passwords
- 📤 **CSV Upload** — Drag-and-drop file upload with real-time progress feedback
- 🗄️ **MongoDB Storage** — Every CSV row is stored as an individual document, isolated per user
- 📊 **Interactive Dashboard** — KPI strip, data preview table, and 3 Recharts visualisations
- 🤖 **AI Insights** — Google Gemini analyses your aggregated data and returns 3 actionable insights
- 📱 **Responsive UI** — Dark glassmorphism design that works on desktop and tablet

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Recharts, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs |
| **File Upload** | Multer |
| **CSV Parsing** | csv-parser |
| **AI / LLM** | Google Gemini (`@google/generative-ai`) |
| **Styling** | Vanilla CSS (custom dark glassmorphism theme) |

---

## 📋 Prerequisites

Make sure you have the following installed before running the project:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18 or higher | https://nodejs.org |
| **npm** | v9 or higher | Comes with Node.js |
| **Git** | Any | https://git-scm.com |

You will also need accounts / credentials for:

- **MongoDB Atlas** — Free cluster at https://cloud.mongodb.com
- **Google Gemini API Key** — Free key at https://aistudio.google.com

---

## 📁 Project Structure

```
TASK/
│
├── sample_data.csv              # Sample CSV (growing trend, North region)
├── sample_data_opposite.csv     # Contrast CSV (declining trend, South region)
│
├── server/                      # Express backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # User schema (email + password_hash)
│   │   ├── Upload.js            # Upload record schema (user_id FK)
│   │   └── UploadRow.js         # CSV row schema (upload_id FK)
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register & /login
│   │   ├── upload.js            # POST /api/upload
│   │   ├── data.js              # GET /api/data/preview & /summary
│   │   └── analytics.js         # GET /api/analytics/charts, POST /insights
│   ├── uploads/                 # Temp folder (auto-created, auto-cleaned)
│   ├── .env                     # Environment variables (DO NOT commit)
│   ├── .gitignore
│   ├── index.js                 # Server entry point
│   └── package.json
│
└── client/                      # React frontend (Vite)
    ├── src/
    │   ├── api/
    │   │   └── axiosInstance.js  # Axios with JWT interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state (token + user)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── KpiStrip.jsx      # 4 KPI metric cards
    │   │   ├── SummaryCard.jsx   # Dataset summary (rows, dates, tags)
    │   │   ├── DataTable.jsx     # First 15 rows preview
    │   │   ├── InsightsPanel.jsx # AI insights with loading state
    │   │   └── charts/
    │   │       ├── SalesTrendChart.jsx   # Area chart (Date vs Sales)
    │   │       ├── RegionBarChart.jsx    # Bar chart (Region vs Sales)
    │   │       └── CategoryPieChart.jsx  # Donut chart (Category share)
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Upload.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx               # Routes + protected route guards
    │   ├── main.jsx
    │   └── index.css             # Full dark theme design system
    ├── index.html
    └── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "DATACRUMBS TASK"
```

### 2. Install server dependencies

```bash
cd server
npm install
```

**Server packages installed:**

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.3 | HTTP server & routing |
| `mongoose` | ^8.3.4 | MongoDB ODM |
| `bcryptjs` | ^2.4.3 | Password hashing (salt rounds: 12) |
| `jsonwebtoken` | ^9.0.2 | JWT signing & verification |
| `multer` | ^1.4.5-lts.1 | Multipart file uploads |
| `csv-parser` | ^3.0.0 | Streaming CSV row parsing |
| `@google/generative-ai` | ^0.24.1 | Google Gemini API client |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `dotenv` | ^16.4.5 | Load `.env` variables |
| `nodemon` | ^3.1.0 | Dev: auto-restart on file changes |

### 3. Configure server environment variables

Create / edit `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_long_random_secret_string_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

> **How to get MongoDB URI:**
> 1. Go to https://cloud.mongodb.com
> 2. Create a free cluster → Connect → Drivers
> 3. Copy the connection string and replace `<password>` with your DB user password

> **How to get Gemini API Key:**
> 1. Go to https://aistudio.google.com
> 2. Click **Get API Key** → Create API Key
> 3. Copy the key into `GEMINI_API_KEY`

> **JWT_SECRET:** Use any long random string, e.g. `my_super_secret_key_2024_xyz`

### 4. Install client dependencies

```bash
cd ../client
npm install
```

**Client packages installed:**

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.x | UI framework |
| `react-dom` | ^18.x | React DOM renderer |
| `react-router-dom` | ^6.x | Client-side routing |
| `axios` | ^1.x | HTTP client with interceptors |
| `recharts` | ^2.x | Chart library (Line, Bar, Pie) |
| `vite` | ^8.x | Build tool & dev server |

---

## ▶️ Running the Application

> **You need two terminal windows running simultaneously.**

### Terminal 1 — Start the backend

```bash
cd server
node index.js
```

OR for development with auto-restart:

```bash
cd server
npm run dev
```

You should see:
```
🚀 DataCrumbs Server running on http://localhost:5000
✅ MongoDB Connected: your-cluster.mongodb.net
```

### Terminal 2 — Start the frontend

```bash
cd client
npm run dev
```

You should see:
```
VITE v8.x  ready in 500ms
➜  Local:   http://localhost:5173/
```

### Open the app

Navigate to **http://localhost:5173** in your browser.

---

## 🧭 User Flow

```
Register / Login
      ↓
Upload CSV File (drag & drop or browse)
      ↓
Dashboard loads automatically:
  ├── KPI Strip (Total Revenue, Units, Avg Order Value, Top Region)
  ├── Dataset Summary Card (rows, date range, categories, regions)
  ├── Sales Trend Chart (Area — Date vs Sales)
  ├── Regional Performance Chart (Bar — Region vs Sales)
  ├── Category Distribution Chart (Donut — Revenue share)
  └── Data Preview Table (first 15 rows)
      ↓
Click "Generate Insights" → Gemini AI analyses and returns 3 insights
```

---

## 📂 Sample CSV Files

Two sample files are included for testing:

### `sample_data.csv` — Normal/Growing Dataset
- **155 rows** | Jan 2024 – Mar 2024
- Subscription-heavy (Pro Plan, Enterprise Suite dominant)
- North region leads
- Sales trend: growing Jan → Mar
- Customer ages: 22–65

### `sample_data_opposite.csv` — Contrasting/Declining Dataset
- **155 rows** | Jan 2024 – Mar 2024
- Add-on & One-time category dominant (Dashboard Add-on, Analytics Pack)
- South & West regions lead
- Sales trend: **declining** Jan → Mar
- Customer ages: 55–75 (older demographic)

### CSV Column Format

Your CSV **must** have these exact column headers (case-sensitive):

```
date,product,category,sales,units_sold,region,customer_age
```

| Column | Type | Example |
|---|---|---|
| `date` | YYYY-MM-DD | `2024-01-15` |
| `product` | string | `Pro Plan` |
| `category` | string | `Subscription` |
| `sales` | number (USD) | `299` |
| `units_sold` | integer | `3` |
| `region` | string | `North` |
| `customer_age` | integer | `34` |

---

## 🔌 API Endpoints

All data routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register with email + password |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT |
| `POST` | `/api/upload` | ✅ | Upload CSV file (multipart/form-data) |
| `GET` | `/api/data/preview` | ✅ | First 15 rows of user's data |
| `GET` | `/api/data/summary` | ✅ | Total rows, date range, KPIs, unique values |
| `GET` | `/api/analytics/charts` | ✅ | Aggregated data for all 3 charts |
| `POST` | `/api/analytics/insights` | ✅ | AI-generated insights via 

---

## 🔒 Security Notes

- Passwords are **never stored in plain text** — bcrypt with salt rounds of 12
- JWTs expire after **7 days**
- All data routes are protected by the JWT middleware
- Each user's data is **fully isolated** — queries always filter by `user_id`
- Uploaded CSV files are deleted from the server immediately after parsing
- A new upload **replaces** all previous data for that user (single-upload policy)

---

## 🤖 AI Insights — How It Works

The `/api/analytics/insights` endpoint:

1. **Aggregates** the user's data server-side (never sends raw rows to the AI)
2. **Builds a structured prompt** including:
   - Total revenue, units, avg order value
   - Regional breakdown (top & bottom regions)
   - Category and product rankings
   - Month-over-month growth percentages
3. **Calls Gemini** with automatic model fallback:
   - Primary: `gemini-1.5-flash` (configurable via `GEMINI_MODEL` in `.env`)
   - Fallback 1: `gemini-1.5-flash`
   - Fallback 2: `gemini-1.5-pro`
4. **Returns** 3 formatted business insights

> **Changing the AI model:** Edit `GEMINI_MODEL` in `server/.env` and restart the server.
> Available options: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`

---

## 🐛 Troubleshooting

### Server won't start
- Check that MongoDB Atlas IP Whitelist includes `0.0.0.0/0` (or your IP)
- Verify `MONGO_URI` is correct in `.env`
- Make sure port 5000 is not in use: `netstat -ano | findstr :5000`

### "Failed to generate AI insights" errors
| Error | Fix |
|---|---|
| `429 Too Many Requests` | Free tier quota exhausted. Wait or change `GEMINI_MODEL` to `gemini-1.5-pro` |
| `503 Service Unavailable` | Model temporarily overloaded. The app will auto-retry with the next model |
| `404 Not Found` | Invalid model name. Use `gemini-1.5-flash` in `.env` |

### Charts not loading
- Ensure the backend is running on port 5000
- Check browser console for CORS errors
- Verify the JWT token hasn't expired (log out and log in again)

### CSV upload fails
- Only `.csv` files are accepted (max 10MB)
- Column headers must match exactly: `date,product,category,sales,units_sold,region,customer_age`
- Dates must be in `YYYY-MM-DD` format

---

## 📜 Scripts Reference

| Directory | Command | Description |
|---|---|---|
| `server/` | `node index.js` | Start server (production) |
| `server/` | `npm run dev` | Start server with nodemon (development) |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Build production bundle |
| `client/` | `npm run preview` | Preview production build locally |

---

## 🌐 Ports

| Service | Port | URL |
|---|---|---|
| Express Backend | 5000 | http://localhost:5000 |
| React Frontend | 5173 | http://localhost:5173 |

---

## 📄 License


*Built with ❤️ using Node.js, React, MongoDB, and Google Gemini AI*
