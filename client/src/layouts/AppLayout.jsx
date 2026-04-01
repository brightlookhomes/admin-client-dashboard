import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="appMain">
        <Outlet />
      </main>
    </div>
  );
}

