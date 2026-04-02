# 🛠️ BrightLook Homes - Project Management Dashboard

BrightLook is a powerful MERN stack application designed for construction and project management. It features a professional **Admin Dashboard** for managing site updates, milestones, and payments, alongside a responsive **Client Portal** for real-time project tracking.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://admin-client-dashboard-ten.vercel.app/](https://admin-client-dashboard-ten.vercel.app/)
- **Backend (Render):** [https://admin-client-dashboard.onrender.com](https://admin-client-dashboard.onrender.com)

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

---

## ☁️ Deployment (Split Architecture)

This project is optimized for high-performance split deployment:

### 👤 Backend (Render)
1. **Service Type:** Web Service.
2. **Build Command:** `npm install`
3. **Start Command:** `node server/index.js`
4. **Environment Variables:**
   - `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### 🎨 Frontend (Vercel)
1. **Framework Preset:** Vite.
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com`)

---

## 🔗 Domain Configuration (Vercel + GoDaddy)
1. In **Vercel** Settings → Domains, add `yourdomain.com`.
2. In **GoDaddy** DNS Management:
   - Add **CNAME** Record: `www` → `cname.vercel-dns.com`
   - Add **A Record**: `@` → `76.76.21.21` (Vercel Default IP)
