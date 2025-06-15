import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nie znaleziono kursu");
        }
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd:", error);
        setCourse(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Ładowanie kursu...</p>;
  if (!course) return <p>Nie znaleziono kursu.</p>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p><strong>Autor:</strong> {course.author}</p>
      <hr />
      <h3>Sekcja 1</h3>
      <p>{course.section_one}</p>
      <h3>Sekcja 2</h3>
      <p>{course.section_two}</p>
      {course.video_url && (
        <div>
          <h3>Wideo</h3>
          <a href={course.video_url} target="_blank" rel="noopener noreferrer">
            Obejrzyj materiał wideo
          </a>
        </div>
      )}
    </div>
  );
}

export default CourseDetailsPage;
