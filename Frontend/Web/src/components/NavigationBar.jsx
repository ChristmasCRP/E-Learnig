import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ userRole, onLoginClick, onLogout }) {
  const location = useLocation();

  const getLinkClass = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  const showLoginButton = !userRole || userRole === "guest";
  const showLogoutButton = userRole === "admin";

  return (
    <div className="navbar-container">
      <h2 className="navbar-title">Karp-Learning</h2>
      <nav>
        <Link to="/" className={getLinkClass("/")}>Strona główna</Link>
        <Link to="/courses" className={getLinkClass("/courses")}>Kursy</Link>
        <Link to="/contact" className={getLinkClass("/contact")}>Kontakt</Link>

        {showLoginButton && (
          <span onClick={onLoginClick} className="nav-item login-link">
            Zaloguj się
          </span>
        )}

        {showLogoutButton && (
          <span onClick={onLogout} className="nav-item login-link">
            Wyloguj się (admin)
          </span>
        )}
      </nav>
    </div>
  );
}

export default NavigationBar;
