import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Lista kursów</h1>
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
              <Link
                to={`/courses/${course.id}`}
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  color: "#007bff"
                }}
              >
                {course.title}
              </Link>
              <p style={{ margin: "0.2rem 0", color: "#555" }}>
                Autor: {course.author}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CoursesPage;
