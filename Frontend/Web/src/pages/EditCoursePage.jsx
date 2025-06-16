import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  const handleSave = () => {
    setSaving(true);
    fetch(`http://localhost:8000/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Edytuj kurs</h1>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Tytuł:
        <input
          type="text"
          name="title"
          value={course.title}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Autor:
        <input
          type="text"
          name="author"
          value={course.author}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Opis:
        <textarea
          name="description"
          value={course.description || ""}
          onChange={handleChange}
          rows="4"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
        />
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {saving ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </div>
  );
}

export default EditCoursePage;
