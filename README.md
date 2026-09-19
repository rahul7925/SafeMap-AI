# SafeMap AI — Real-Time Geospatial Safety & Crime Intelligence System

SafeMap AI is a **real-time, full-stack web application** designed to dynamically evaluate safety scores, crime distributions, and route safety across **any location on Earth**. 

Unlike static mockups, this application integrates a **Node.js/Express REST API backend** with persistent storage (`data.json`), dynamic deterministic geospatial AI scoring engines, **OpenStreetMap Nominatim Geocoding API** for worldwide searches, and a **React + Vite + Leaflet** interactive frontend.

---

## 🌟 Key Features & Specification Alignment

1. **Worldwide Search Like Google Maps (`OpenStreetMap Nominatim API`)**
   - Type *any* city, landmark, or street on Earth (e.g., `New York`, `Tokyo`, `Coimbatore Railway Station`, `London`) in the header search bar.
   - The backend live-geocodes coordinates and generates realistic **Overall Safety Scores (0-100)**, 7 sub-category scores, and 12-month crime distribution telemetry.

2. **Interactive Click-Anywhere Geospatial Exploration**
   - Click any coordinate on the live world map to drop a point, reverse geocode the area, and inspect safety analytics instantly.

3. **All 7 Safety Categories (Specification Page 6)**
   - `Women Safety` · `Night Safety` · `Child Safety` · `Tourist Safety` · `Senior Citizen Safety` · `Emergency Response` · `Traffic Safety`

4. **12-Month Crime Distribution Breakdown**
   - Dynamic percentages for `Vehicle Theft`, `Robbery`, `Harassment`, `Assault`, `Cyber Crime`, and `Others` summing to 100%.

5. **Standout Feature: Route Safety Comparison (Page 5)**
   - Compare **Safest Route** vs **Balanced Route** vs **Fastest Route** with real-time ETA, distance, street lighting %, and CCTV coverage % plotted on the Leaflet map.

6. **Verified Community Reporting System (Page 5 & 11)**
   - Users can drop GPS pins anywhere on Earth and submit reports (`Poor street lighting`, `Suspicious activity`, `Heavy crowd`, etc.).
   - Saved to persistent backend storage (`data.json`) with **Admin Verified** badge simulation as recommended in the specification.

7. **Phase 4: Real-Time AI Safety Assistant (`Ask AI`)**
   - Interactive conversational assistant answering safety questions about any worldwide location or time-of-day risk.

8. **30-Day Crime Trend Analytics Modal**
   - District rankings, safest vs moderate zone highlights, and complete comparative table.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite 5, React-Leaflet, Leaflet, Lucide-React, Tailwind/Custom CSS Design System
- **Backend API**: Node.js, Express.js, CORS, Axios
- **Geocoding & Mapping API**: Leaflet + OpenStreetMap Vector Tiles & Nominatim API (100% Free, no billing key required)
- **Database**: Persistent local JSON datastore (`server/data.json`) + Dynamic deterministic world engine (`crimeEngine.js`)

---

## 🚀 How to Run Locally

### Option 1: Using Windows Launcher Script (Recommended)
Right-click or run from Windows PowerShell in the project root:
```powershell
.\start-safemap.ps1
```
This automatically launches both the backend API server on **Port 5000** and the frontend on **Port 5173**.

---

### Option 2: Manual Terminal Startup
1. **Start the Backend Server (Port 5000):**
   ```bash
   cd server
   npm start
   ```
   *You should see:* `[SafeMap AI Server] Real-Time Crime Intelligence API listening on port 5000`

2. **Start the React Frontend (Port 5173):**
   ```bash
   cd client
   npm run dev
   ```
   *Open your browser at* `http://localhost:5173`

---

## 🔌 Backend REST API Endpoints (`http://localhost:5000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/locations` | Returns all stored verified locations & community reports |
| `GET` | `/api/locations/search?q=...` | Worldwide search via OpenStreetMap Nominatim + dynamic crime engine |
| `GET` | `/api/locations/geocode?lat=..&lng=..` | Reverse geocodes clicked coordinates anywhere on Earth |
| `POST` | `/api/reports` | Adds a new verified community report to live database |
| `POST` | `/api/ai/chat` | Generates AI safety intelligence response for location/prompt |
