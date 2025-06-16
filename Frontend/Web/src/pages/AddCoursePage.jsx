import React, { useState } from "react";
import "./CourseForm.css";

function AddCoursePage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sections, setSections] = useState([{ number: "1", title: "", content: "" }]);

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { number: String(sections.length + 1), title: "", content: "" }]);
  };

  const removeSection = (index) => {
    const updated = sections.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      number: String(i + 1),
    }));
    setSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const course = {
      title,
      author,
      video_url: videoUrl,
      sections,
    };

    try {
      const response = await fetch("http://localhost:8000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert("✅ Kurs został dodany!");
        setTitle("");
        setAuthor("");
        setVideoUrl("");
        setSections([{ number: "1", title: "", content: "" }]);
      } else {
        const err = await response.json();
        alert(`❌ Błąd: ${err.detail || "Nie udało się dodać kursu."}`);
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("❌ Wystąpił błąd podczas dodawania kursu.");
    }
  };

  return (
    <div className="course-form-container">
      <h1>Dodaj nowy kurs</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Tytuł kursu:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Autor kursu:
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </label>
        <label>
          Link do wideo:
          <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </label>

        <h3>Sekcje:</h3>
        {sections.map((section, index) => (
          <div key={index} className="section-box">
            <label>
              Tytuł sekcji:
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                required
              />
            </label>
            <label>
              Treść sekcji:
              <textarea
                value={section.content}
                onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                required
              />
            </label>
            {sections.length > 1 && (
              <button type="button" onClick={() => removeSection(index)}>
                ❌ Usuń sekcję
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addSection}>
          ➕ Dodaj sekcję
        </button>
        <button type="submit">➕ Dodaj kurs</button>
      </form>
    </div>
  );
}

export default AddCoursePage;
