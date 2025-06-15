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
import AddCourseModal from "./components/AddCourseModal";
import EditCourseModal from "./components/EditCourseModal";
import DeleteCourseModal from "./components/DeleteCourseModal";

function App() {
  const [userRole, setUserRole] = useState(null); // null, 'guest', 'admin'
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    setShowLoginModal(true); // pokaż login przy pierwszym wejściu
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

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <NavigationBar
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onAddCourseClick={() => setShowAddModal(true)}
          onEditCourseClick={() => setShowEditModal(true)}
          onDeleteCourseClick={() => setShowDeleteModal(true)}
        />
        <div style={{ marginLeft: "220px", padding: "2rem", flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
          </Routes>
        </div>

        {/* Modale */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
        <AddCourseModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        <EditCourseModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
        <DeleteCourseModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />

        <Toast message={toast.message} visible={toast.visible} />
      </div>
      <ChatWidget />
    </Router>
  );
}

export default App;
