# VoyaGo™ — AI-Powered Travel Management Platform

<div align="center">
  <h3>Your World. Your Journey. Reimagined.</h3>
  <p><strong>VoyaGo Technologies Pvt. Ltd.</strong> | Version 2.0.0 | Patent Pending</p>
</div>

---

## 🌐 Overview

**VoyaGo™** is an enterprise-grade, AI-powered travel management platform that enables travelers to book flights, luxury hotels, car rentals, trains, buses, and curated tour packages — all in one beautifully designed, secure, and intelligent interface.

Built for scale. Designed for elegance. Trusted by millions.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 6, React Router v7 |
| **Styling** | Vanilla CSS, Glassmorphism Design System |
| **Backend** | Node.js, Express 4, MongoDB (Mongoose) |
| **Auth** | JWT (7-day expiry), bcrypt (12 rounds) |
| **Email** | Nodemailer + Gmail SMTP |
| **Flights API** | Amadeus Travel REST API |
| **Maps** | Leaflet + React-Leaflet |
| **Mobile** | Capacitor (Android APK) |
| **QR Codes** | qrcode.react |
| **Payments** | Modal-based (Razorpay-ready) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup

```bash
git clone https://github.com/VoyaGoTech/voyago-platform.git
cd voyago-platform/travel-management-system
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL

# Start development server
npm run dev
```

### 3. Backend Setup

```bash
cd travel-management-backend

# Install dependencies
npm install

# Configure environment
# Edit .env — set MONGO_URI, JWT_SECRET, etc.

# Start development server
npm run dev

# Start production server
npm start
```

---

## 🔑 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=VoyaGo
```

### Backend (`.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/voyago-travel
PORT=5000
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
AMADEUS_CLIENT_ID=your-amadeus-id
AMADEUS_CLIENT_SECRET=your-amadeus-secret
```

---

## 📁 Project Structure

```
travel-management-system/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx          # ⭐ Main dashboard
│   │   ├── Login.jsx             # Auth — login
│   │   ├── Register.jsx          # Auth — registration
│   │   ├── Flights.jsx           # Flight booking
│   │   ├── Hotel-booking/        # Hotel booking
│   │   ├── Car-rental/           # Car rental
│   │   ├── TrainBooking/         # Train booking
│   │   ├── WorldTour.jsx         # World tour explorer
│   │   ├── TourBooking.jsx       # Tour packages
│   │   ├── TripPlanner.jsx       # AI trip planner
│   │   ├── ReviewsRatings.jsx    # Community reviews
│   │   ├── MyBookings.jsx        # Booking management
│   │   ├── AdminDashboard.jsx    # Admin panel
│   │   ├── AIAssistant.jsx       # AI travel concierge
│   │   └── UserProfile.jsx       # User profile
│   ├── busbooking/               # Bus booking module
│   ├── index.css                 # VoyaGo Design System
│   ├── App.jsx                   # Root router
│   └── main.jsx                  # Entry point
├── travel-management-backend/
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API route handlers
│   ├── middleware/               # Auth & validation
│   ├── utils/                    # Helper utilities
│   └── server.js                 # Express server
├── public/
│   └── manifest.json             # PWA manifest
└── index.html                    # SEO-optimized entry
```

---

## 🌟 Key Features

### ✈️ Travel Services
- **Flights** — Real-time search via Amadeus API with fare comparison
- **Hotels** — Luxury hotel discovery and instant booking
- **Car Rentals** — Premium vehicle rental with live availability
- **Trains** — Scenic rail journey booking with seat selection
- **Buses** — Comfortable bus reservation with ticket generation
- **Tour Packages** — All-inclusive curated world tours
- **World Tour** — Interactive global destination explorer

### 🧠 Intelligence
- **AI Trip Planner** — Generate complete multi-day itineraries
- **AI Travel Concierge** — 24/7 in-app AI assistant
- **Live Tracking** — Real-time vehicle/flight tracking map

### 👤 User Experience
- **JWT Authentication** — Secure session management
- **Protected Routes** — Role-based access (User / Admin)
- **My Bookings** — Complete booking history with tickets & QR codes
- **Community Reviews** — 5-star rating system
- **User Profile** — Manage preferences and account settings
- **APK Download** — Install as native Android app (Capacitor)

### 🛡️ Admin Panel
- Booking oversight and management
- User administration
- Revenue analytics

---

## 🔐 Security

| Feature | Implementation |
|---|---|
| Password Hashing | bcrypt (12 salt rounds) |
| Authentication | JWT (7-day expiry, RS256-ready) |
| CORS | Configurable allowlist |
| Input Validation | Express Validator + Zod |
| Sensitive Data | Environment variables only |
| Rate Limiting | Configurable per-route |
| HTTPS | Nginx/Cloudflare in production |

---

## 🚢 Deployment Guide

### Production Deployment

1. **Frontend** → Deploy to Vercel / Netlify / AWS S3 + CloudFront
2. **Backend** → Deploy to Railway / Render / AWS EC2 / DigitalOcean
3. **Database** → MongoDB Atlas (recommended)
4. **CDN** → Cloudflare for edge caching

### Build for Production

```bash
# Frontend
npm run build
# Output: dist/

# Backend
npm start
# With PM2: pm2 start server.js --name voyago-api
```

---

## 📱 Mobile App (Android)

VoyaGo ships as a native Android app via Capacitor:

```bash
npm run build
npx cap sync android
npx cap open android
# Build APK from Android Studio
```

---

## 🌍 API Documentation

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create new user account |
| POST | `/api/login` | Authenticate and get JWT |
| GET | `/api/me` | Get current user (protected) |
| PATCH | `/api/me` | Update profile (protected) |
| GET | `/api/health` | Health check |

### Travel Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/flights` | Search/list flights |
| GET | `/api/hotels` | List hotels |
| GET | `/api/hotel-bookings` | Hotel bookings |
| GET | `/api/cars` | List cars |
| GET | `/api/rentals` | Car rentals |
| GET | `/api/trains` | Train routes |
| GET | `/api/tours` | Tour packages |
| GET | `/api/bus-reservations` | Bus reservations |

---

## 🏢 About VoyaGo Technologies

**VoyaGo Technologies Pvt. Ltd.** is a travel-tech startup focused on democratizing premium travel through intelligent automation and world-class design.

- 🌐 Website: [voyago.travel](https://voyago.travel)
- 📧 Support: support@voyago.travel
- 🐦 Twitter: [@VoyaGoTravel](https://twitter.com/voyagotravel)
- 💼 LinkedIn: [VoyaGo Technologies](https://linkedin.com/company/voyago)

---

## 📄 Legal

```
Copyright © 2025 VoyaGo Technologies Pvt. Ltd.
All Rights Reserved.

VoyaGo™ is a registered trademark of VoyaGo Technologies Pvt. Ltd.
This platform and its design are protected under applicable intellectual
property laws. Patent applications pending.

Unauthorized reproduction, distribution, or use of this platform
or its components is strictly prohibited.
```

---

<div align="center">
  <sub>Built with ❤️ by VoyaGo Technologies | <strong>Your World. Your Journey. Reimagined.</strong></sub>
</div>
