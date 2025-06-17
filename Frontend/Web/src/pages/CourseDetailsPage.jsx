import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CourseDetailsPage.css";

function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nie znaleziono kursu");
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
    <div className="course-details-container">
      <h1 className="course-title">{course.title}</h1>
      <p className="course-author">Autor: {course.author}</p>

      {course.sections?.length > 0 && (
        <>
          <div className="tabs">
            {course.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`tab-button ${activeTab === index ? "active" : ""}`}
              >
                Sekcja {section.number}
              </button>
            ))}
          </div>

          <div className="tab-content">
            <h3>
              {course.sections[activeTab].number}. {course.sections[activeTab].title}
            </h3>
            <p>{course.sections[activeTab].content}</p>
          </div>
        </>
      )}

      {course.video_url && (
        <div className="video-section">
          <h3>Wideo</h3>
          <a href={course.video_url} target="_blank" rel="noopener noreferrer">
            ▶️ Obejrzyj materiał wideo
          </a>
        </div>
      )}
    </div>
  );
}

export default CourseDetailsPage;
