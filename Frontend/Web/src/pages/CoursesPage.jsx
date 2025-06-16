import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CoursesPage({ refreshTrigger }) {
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

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Lista kursów</h1>

      {isAdmin && (
        <button
          onClick={() => navigate("/courses/new")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          ➕ Dodaj nowy kurs
        </button>
      )}

      {loading ? (
        <p>Ładowanie...</p>
      ) : courses.length === 0 ? (
        <p>Brak dostępnych kursów.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {courses.map((course) => (
            <li
              key={course.id}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Link
                    to={`/courses/${course.id}`}
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      textDecoration: "none",
                      color: "#007bff",
                    }}
                  >
                    {course.title}
                  </Link>
                  <p style={{ margin: "0.2rem 0", color: "#555" }}>Autor: {course.author}</p>
                </div>

                {isAdmin && (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Link to={`/courses/${course.id}/edit`} style={{ color: "orange", textDecoration: "none" }}>
                      ✏️ Edytuj
                    </Link>
                    <button
                      onClick={() => alert(`Potwierdź usunięcie kursu "${course.title}" (placeholder)`)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "red",
                        cursor: "pointer",
                      }}
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
