import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import http from "../api/http.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function Login() {
  // Placeholder client-side check until backend/auth is connected.
  // Change this value (or set `VITE_ADMIN_PASSWORD`) as needed.
  const validPassword = useMemo(() => {
    const fromEnv = import.meta.env.VITE_ADMIN_PASSWORD;
    return typeof fromEnv === "string" && fromEnv.length > 0
      ? fromEnv
      : "admin123";
  }, []);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(() => import.meta.env.VITE_ADMIN_EMAIL || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthed, setToken } = useAuth();


  async function handleLogin(e) {
    e.preventDefault();

    // Prefer backend login if email is provided; keep password-only fallback for UI.
    try {
      setLoading(true);
      if (!email) {
        if (password !== validPassword) {
          toast.error("Invalid Credentials");
          return;
        }
        toast.success("Logged in");
        navigate("/dashboard");
        return;
      }

      const { data } = await http.post("/auth/login", { email, password });
      setToken(data.token);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard" role="main" aria-label="Login">
        <div className="loginLogoWrap">
          <img className="brandLogo" src="/logo.png" alt="BrightLook Homes" />
        </div>

        <h1 className="loginTitle">Brightlook Homes</h1>
        <p className="loginSubtitle">Construction &amp; Project Management</p>

        <form className="loginForm" onSubmit={handleLogin}>
          <label className="loginLabel" htmlFor="adminEmail">
            Admin Email
          </label>
          <div className="loginInputWrap">
            <input
              id="adminEmail"
              className="loginInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="admin@brightlook.com"
            />
          </div>

          <label className="loginLabel" htmlFor="adminPassword">
            Admin Password
          </label>

          <div className="loginInputWrap">
            <Lock className="loginIcon" aria-hidden="true" size={18} />
            <input
              id="adminPassword"
              className="loginInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </div>

          <button className="loginButton" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

