import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseForm.css";

function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...course.sections];
    updatedSections[index][field] = value;
    setCourse((prev) => ({ ...prev, sections: updatedSections }));
  };

  const addSection = () => {
    setCourse((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), { number: "", title: "", content: "" }],
    }));
  };

  const removeSection = (index) => {
    const updatedSections = [...course.sections];
    updatedSections.splice(index, 1);
    setCourse((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleSave = () => {
    setSaving(true);
    fetch(`http://localhost:8000/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify(course),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Błąd podczas zapisywania");
        navigate("/courses");
      })
      .catch((err) => {
        alert(err.message);
        setSaving(false);
      });
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;
  if (!course) return null;

  return (
    <div className="course-form-container">
      <h1>Edytuj kurs</h1>
      <label>
        Tytuł:
        <input type="text" name="title" value={course.title} onChange={handleChange} />
      </label>
      <label>
        Autor:
        <input type="text" name="author" value={course.author} onChange={handleChange} />
      </label>
      <label>
        URL filmu:
        <input type="text" name="video_url" value={course.video_url || ""} onChange={handleChange} />
      </label>

      <h3>Sekcje:</h3>
      {course.sections?.map((section, index) => (
        <div key={index} className="section-box">
          <label>
            Numer:
            <input
              type="text"
              value={section.number}
              onChange={(e) => handleSectionChange(index, "number", e.target.value)}
            />
          </label>
          <label>
            Tytuł:
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange(index, "title", e.target.value)}
            />
          </label>
          <label>
            Treść:
            <textarea
              rows="3"
              value={section.content}
              onChange={(e) => handleSectionChange(index, "content", e.target.value)}
            />
          </label>
          <button type="button" onClick={() => removeSection(index)}>
            ❌ Usuń sekcję
          </button>
        </div>
      ))}

      <button type="button" onClick={addSection}>
        ➕ Dodaj sekcję
      </button>
      <button onClick={handleSave} disabled={saving}>
        {saving ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </div>
  );
}

export default EditCoursePage;
