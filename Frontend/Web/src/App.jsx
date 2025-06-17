import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import NavigationBar from "./components/NavigationBar";
import ChatWidget from "./components/ChatWidget";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";
import ToastConfirm from "./components/ToastConfirm";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import EditCoursePage from "./pages/EditCoursePage";
import AddCoursePage from "./pages/AddCoursePage";
import CoursesPage from "./pages/CoursesPage";
import "./themes.css"; // ✅ dodajemy style motywów

function App() {
  const [userRole, setUserRole] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [refreshCourses, setRefreshCourses] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  // 🌓 Motyw
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const showConfirm = (message, confirmCallback) => {
    setConfirmMessage(message);
    setOnConfirm(() => () => {
      confirmCallback();
      setConfirmVisible(false);
    });
    setConfirmVisible(true);
  };

  useEffect(() => {
    setShowLoginModal(true);
  }, []);

  const handleLogin = (isAdmin) => {
    setUserRole(isAdmin ? "admin" : "guest");
    setShowLoginModal(false);
    showToast(isAdmin ? "Zalogowano pomyślnie!" : "Kontynuujesz jako gość");
  };

  const handleLogout = () => {
    setUserRole(null);
    setShowLoginModal(true);
    showToast("Wylogowano pomyślnie.");
  };

  const triggerCoursesRefresh = () => {
    setRefreshCourses((prev) => !prev);
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <NavigationBar
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          toggleTheme={toggleTheme} // 🌓 przekazujemy przełącznik
          currentTheme={theme}
        />
        <div style={{ marginLeft: "220px", padding: "2rem", flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/courses"
              element={
                <CoursesPage
                  refreshTrigger={refreshCourses}
                  showToast={showToast}
                  showConfirm={showConfirm}
                  triggerCoursesRefresh={triggerCoursesRefresh}
                />
              }
            />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/courses/:id/edit" element={<EditCoursePage />} />
            <Route path="/courses/new" element={<AddCoursePage />} />
          </Routes>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />

        <Toast message={toast.message} visible={toast.visible} />

        <ToastConfirm
          visible={confirmVisible}
          message={confirmMessage}
          onConfirm={onConfirm}
          onCancel={() => setConfirmVisible(false)}
        />
      </div>

      <ChatWidget />
    </Router>
  );
}

export default App;
