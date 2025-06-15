import React, { useState } from "react";
import "./CourseModal.css";

function AddCourseModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [sectionOne, setSectionOne] = useState("");
  const [sectionTwo, setSectionTwo] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleAdd = async () => {
    const course = { title, author, section_one: sectionOne, section_two: sectionTwo, video_url: videoUrl };
    const token = localStorage.getItem("authToken");

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
        alert("Kurs dodany!");
        onClose();
      } else {
        alert("Błąd przy dodawaniu kursu");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Dodaj nowy kurs</h3>
        <input placeholder="Tytuł" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Autor" value={author} onChange={e => setAuthor(e.target.value)} />
        <textarea placeholder="Sekcja 1" value={sectionOne} onChange={e => setSectionOne(e.target.value)} />
        <textarea placeholder="Sekcja 2" value={sectionTwo} onChange={e => setSectionTwo(e.target.value)} />
        <input placeholder="Link do filmu" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />

        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button guest">Anuluj</button>
          <button onClick={handleAdd} className="modal-button login">Dodaj kurs</button>
        </div>
      </div>
    </div>
  );
}

export default AddCourseModal;
