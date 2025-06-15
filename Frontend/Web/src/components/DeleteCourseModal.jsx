import React, { useState } from "react";
import "./CourseModal.css";

function DeleteCourseModal({ isOpen, onClose }) {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8000/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Kurs usunięty!");
        onClose();
      } else {
        alert("Błąd przy usuwaniu kursu");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Usuń kurs</h3>
        <input placeholder="ID kursu" value={id} onChange={e => setId(e.target.value)} />

        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button guest">Anuluj</button>
          <button onClick={handleDelete} className="modal-button login">Usuń kurs</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCourseModal;
