import React, { useState } from "react";

function AddCoursePage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sections, setSections] = useState([""]);

  const handleSectionChange = (index, value) => {
    const newSections = [...sections];
    newSections[index] = value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, ""]);
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const course = { title, author, video_url: videoUrl, sections };

    try {
      const response = await fetch("http://localhost:8000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(course)
      });

      if (response.ok) {
        alert("Kurs został dodany!");
        setTitle("");
        setAuthor("");
        setVideoUrl("");
        setSections([""]);
      } else {
        alert("Błąd przy dodawaniu kursu.");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <div>
      <h2>Dodaj nowy kurs</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Tytuł kursu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
          required
        />
        <input
          type="text"
          placeholder="Autor kursu"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
          required
        />
        <input
          type="text"
          placeholder="Link do wideo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <h4>Sekcje:</h4>
        {sections.map((section, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <textarea
              placeholder={`Sekcja ${index + 1}`}
              value={section}
              onChange={(e) => handleSectionChange(index, e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
            {sections.length > 1 && (
              <button type="button" onClick={() => removeSection(index)} style={{ marginTop: "0.3rem" }}>
                Usuń
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSection} style={{ marginBottom: "1rem" }}>
          ➕ Dodaj sekcję
        </button>
        <br />
        <button type="submit">Dodaj kurs</button>
      </form>
    </div>
  );
}

export default AddCoursePage;
