import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import ContactPage from "./pages/ContactPage";
import NavigationBar from "./components/NavigationBar";
import ChatWidget from "./components/ChatWidget";
import LoginModal from "./components/LoginModal";
import Notification from "./components/Notification";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [authInfo, setAuthInfo] = useState(null); // { username, role, token }
  const [notification, setNotification] = useState(null); // tekst komunikatu

  useEffect(() => {
    // opcjonalnie można sprawdzić localStorage, aby utrzymać sesję
    const savedAuth = sessionStorage.getItem("auth");
    if (savedAuth) {
      setAuthInfo(JSON.parse(savedAuth));
      setShowLoginModal(false);
    }
  }, []);

  const handleLogin = (info) => {
    setAuthInfo(info);
    sessionStorage.setItem("auth", JSON.stringify(info));
    setNotification(
      info.role === "guest"
        ? "Kontynuujesz jako gość"
        : "Zalogowano pomyślnie!"
    );
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setAuthInfo(null);
    sessionStorage.removeItem("auth");
    setNotification("Wylogowano pomyślnie");
    setTimeout(() => setNotification(null), 3000);
    setShowLoginModal(true);
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <NavigationBar
          onLoginClick={() => setShowLoginModal(true)}
          onLogoutClick={handleLogout}
          authInfo={authInfo}
        />
        <div style={{ marginLeft: "220px", padding: "2rem", flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
        <ChatWidget />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
        {notification && <Notification message={notification} />}
      </div>
    </Router>
  );
}

export default App;
