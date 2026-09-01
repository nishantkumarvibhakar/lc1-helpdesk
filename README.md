<<<<<<< HEAD
# lc1-helpdesk
This website is specifically designed for LC1 , University of Delhi (DU) students, to support them during Prashant Diwakar’s campaign for the Presidential election. 
=======
# 🏛️ LC1 Student Help Desk
### An Initiative by Team Prashant Diwakar
*Official Student Grievance Redressal & Support Portal for Law Centre-1, Faculty of Law, University of Delhi*

---

## 🌟 Overview
LC1 Student Help Desk is a production-ready, full-stack student support portal built with **React, Vite, Tailwind CSS, Node.js, and Express**. It allows LC-1 LL.B. students to submit academic, exam, fee, document, and library queries, track resolution progress via unique ticket IDs (`#LC1-2026-XXXXX`), and enables Team Prashant Diwakar coordinators to resolve issues transparently.

---

## 🚀 How to Run Locally

### 1. Start the Backend Server (Port 5000)
```bash
cd server
npm install
npm start
```

### 2. Start the Frontend Application (Port 5173)
```bash
cd client
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Student** | `student@lc1.du.ac.in` | `student123` | Student Dashboard & Query Tracker |
| **Admin (Team Lead)** | `admin@lc1helpdesk.in` | `admin123` | Admin Control Room & Triage |

---

## ☁️ Deployment Guide (100% Free Hosting)

### 🥇 Option 1: 1-Click Unified Full-Stack Deploy on Render.com (Recommended)
You can host both the frontend and backend together on a single free Render Web Service:

1. Push this project folder to your **GitHub** repository (`git init`, `git add .`, `git commit -m "Initial commit"`, `git push`).
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables in Render:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your_secure_random_secret_string`
6. Click **Deploy Web Service**. Your website will be live with a free SSL domain (e.g., `https://lc1-helpdesk.onrender.com`)!

---

### 🥈 Option 2: Frontend on Vercel + Backend on Render

#### A. Backend on Render:
1. Create a Web Service on Render with **Root Directory**: `server`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. Copy your backend URL (e.g. `https://lc1-api.onrender.com`).

#### B. Frontend on Vercel:
1. Import the repository on [Vercel](https://vercel.com).
2. Set **Root Directory**: `client`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://lc1-api.onrender.com`
4. Deploy! Vercel will host the frontend with fast global CDN.

---

## 📂 Project Structure

```
lc1-helpdesk/
├── client/              # React + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/  # Navbar, Footer, Marquee, Badges
│   │   ├── pages/       # Home, RaiseTicket, Track, Dashboard, Admin
│   │   ├── context/     # Auth Context
│   │   └── services/    # API Client
│   ├── public/          # _redirects (SPA routing)
│   └── package.json
│
├── server/              # Express.js REST API Backend
│   ├── data/            # Local JSON Data Store (db.json)
│   ├── routes/          # Auth, Tickets, Notices, FAQs, Team, Stats
│   ├── middleware/      # JWT Authentication & Admin Guards
│   ├── server.js        # Server Entry Point (serves client/dist)
│   └── package.json
│
├── package.json         # Root unified build script
├── vercel.json          # Vercel configuration
└── README.md
```
>>>>>>> c714472 (feat: complete LC-1 Help Desk & Campaign Portal for Prashant Kumar Diwakar)
