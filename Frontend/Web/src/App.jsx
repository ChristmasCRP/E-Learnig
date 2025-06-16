import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import ContactPage from "./pages/ContactPage";
import NavigationBar from "./components/NavigationBar";
import ChatWidget from "./components/ChatWidget";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import EditCoursePage from "./pages/EditCoursePage";
import AddCoursePage from "./pages/AddCoursePage";




function App() {
  const [userRole, setUserRole] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [refreshCourses, setRefreshCourses] = useState(false);

  useEffect(() => {
    setShowLoginModal(true);
  }, []);

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

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
        />
        <div style={{ marginLeft: "220px", padding: "2rem", flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage refreshTrigger={refreshCourses} />} />
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
      </div>
      <ChatWidget />
    </Router>
  );
}

export default App;
