import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CoursesPage.css";

function CoursesPage({
  refreshTrigger,
  showToast = () => {},
  showConfirm = (msg, cb) => {
    if (window.confirm(msg)) cb();
  },
  triggerCoursesRefresh = () => {},
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("authToken") === "sekretny-klucz-admina-123";

  const fetchCourses = () => {
    setLoading(true);
    fetch("http://localhost:8000/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania kursów:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  const handleDelete = async (courseId, courseTitle) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Błąd podczas usuwania kursu.");
      }

      showToast("✅ Kurs został usunięty.");
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      triggerCoursesRefresh();
    } catch (error) {
      showToast("❌ " + error.message);
    }
  };

  return (
    <div className="courses-container">
      <h1 className="courses-title">Lista kursów</h1>

      {isAdmin && (
        <button
          onClick={() => navigate("/courses/new")}
          className="add-course-button"
        >
          ➕ Dodaj nowy kurs
        </button>
      )}

      {loading ? (
        <p>Ładowanie...</p>
      ) : courses.length === 0 ? (
        <p>Brak dostępnych kursów.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.id} className="course-item">
              <div className="course-row">
                <div>
                  <Link to={`/courses/${course.id}`} className="course-link">
                    {course.title}
                  </Link>
                  <p className="course-author">Autor: {course.author}</p>
                </div>

                {isAdmin && (
                  <div className="course-actions">
                    <Link to={`/courses/${course.id}/edit`} className="edit-link">
                      ✏️ Edytuj
                    </Link>
                    <button
                      onClick={() =>
                        showConfirm(`Czy na pewno chcesz usunąć kurs "${course.title}"?`, () =>
                          handleDelete(course.id, course.title)
                        )
                      }
                      className="delete-button"
                    >
                      ❌ Usuń
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CoursesPage;
