import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({
  userRole,
  onLoginClick,
  onLogout,
  toggleTheme,
  currentTheme,
}) {
  const location = useLocation();

  const getLinkClass = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  const isAdmin = userRole === "admin";
  const isGuest = !userRole || userRole === "guest";

  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <h2 className="navbar-title">Karp-Learning</h2>

        {/* 🌗 Suwak motywu */}
        <div className="theme-toggle">
          <input
            type="checkbox"
            id="themeSwitch"
            checked={currentTheme === "light"}
            onChange={toggleTheme}
          />
          <label htmlFor="themeSwitch" className="switch">
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <nav>
        <Link to="/" className={getLinkClass("/")}>Strona główna</Link>
        <Link to="/courses" className={getLinkClass("/courses")}>Kursy</Link>
        <Link to="/contact" className={getLinkClass("/contact")}>Kontakt</Link>

        {isGuest && (
          <span onClick={onLoginClick} className="nav-item login-link">
            Zaloguj się
          </span>
        )}

        {isAdmin && (
          <span onClick={onLogout} className="nav-item login-link">
            Wyloguj się (admin)
          </span>
        )}
      </nav>
    </div>
  );
}

export default NavigationBar;
