import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbarLeft">
        <img className="navbarLogo" src="/logo.png" alt="Brightlook Homes logo" />
        <span className="navbarTitle">Brightlook Homes</span>
      </div>

      <button
        className="navbarLogout"
        type="button"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </header>
  );
}

