# 🛠️ BrightLook Homes - Project Management Dashboard

BrightLook is a powerful MERN stack application designed for construction and project management. It features a professional **Admin Dashboard** for managing site updates, milestones, and payments, alongside a responsive **Client Portal** for real-time project tracking.

## 🚀 Live Demo
**Deployed on Render:** [https://admin-client-dashboard.onrender.com](https://admin-client-dashboard.onrender.com)

---

## ✨ Features

### 👤 Admin Portal
- **Project Overviews:** Track multiple construction projects in real-time.
- **Work Progress:** Post mult-media updates (images/videos) with a swipe-enabled fullscreen viewer.
- **Payment Tracking:** Log payments and view dynamic progress bars against contract values.
- **Milestone Management:** Track project phases with interactive checkboxes.
- **Client Sharing:** Generate secure, unique links for clients to view their specific project portal.

### 🏠 Client Portal
- **Transparent Updates:** View the latest site photos, videos, and descriptions.
- **Live Progress:** Real-time visibility into overall project percentage and timelines.
- **Financial Status:** Sleek payment history and balance tracking.
- **Read-Only Security:** Clients can view everything, but only admins can modify data.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), React Router, React Hot Toast, Lucide Icons, React Icons.
- **Backend:** Node.js, Express.js (v5), MongoDB (Mongoose), JWT Authentication.
- **Storage:** Cloudinary (Media management).
- **Styling:** Custom Professional CSS (Amazon-inspired minimalism).

---

## 💻 Local Development

### Prerequisites
- Node.js installed.
- MongoDB Atlas account.
- Cloudinary account.

### ⚙️ Setup
1. Clone the repository.
2. **Backend:**
   - `cd server`
   - Create a `.env` file with: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLOUDINARY_*` keys.
   - `npm install`
   - `npm run dev`
3. **Frontend:**
   - `cd client`
   - `npm install`
   - `npm run dev`

---

## ☁️ Deployment (Render)

This project is optimized for deployment as a single **Web Service** on Render:
1. The root `package.json` handles building the frontend and serving it through the backend.
2. In production, the backend serves the `client/dist` directory as static files.
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
