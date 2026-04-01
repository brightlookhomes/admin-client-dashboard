import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import AppLayout from "./layouts/AppLayout.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import "./pages/Login.css";
import "./AppShell.css";

const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Project = lazy(() => import("./pages/Project.jsx"));
const ClientPortal = lazy(() => import("./pages/ClientPortal.jsx"));
const Client = lazy(() => import("./pages/Client.jsx"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
          <Routes>

            {/* Public client portal (no login) */}
            <Route path="/client/:projectId" element={<ClientPortal />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project/:id" element={<Project />} />
                {/* Reserved for future internal client view */}
                <Route path="/client/internal/:id" element={<Client />} />
              </Route>
            </Route>

            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
