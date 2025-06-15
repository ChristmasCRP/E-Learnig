import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({
  userRole,
  onLoginClick,
  onLogout,
  onAddCourseClick,
  onEditCourseClick,
  onDeleteCourseClick,
}) {
  const location = useLocation();

  const getLinkClass = (path) =>
    location.pathname === path ? "nav-item active" : "nav-item";

  const isAdmin = userRole === "admin";
  const isGuest = !userRole || userRole === "guest";

  return (
    <div className="navbar-container">
      <h2 className="navbar-title">Karp-Learning</h2>
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
          <>
            <span onClick={onLogout} className="nav-item login-link">
              Wyloguj się (admin)
            </span>

            <div className="admin-menu">
              <hr />
              <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Admin</p>
              <span onClick={onAddCourseClick} className="nav-item">➕ Dodaj kurs</span>
              <span onClick={onEditCourseClick} className="nav-item">✏️ Edytuj kurs</span>
              <span onClick={onDeleteCourseClick} className="nav-item">❌ Usuń kurs</span>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

export default NavigationBar;
