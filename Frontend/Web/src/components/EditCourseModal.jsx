import React, { useState } from "react";
import "./CourseModal.css";

function EditCourseModal({ isOpen, onClose }) {
  const [id, setId] = useState("");
  const [field, setField] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleEdit = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8000/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (response.ok) {
        alert("Kurs zaktualizowany!");
        onClose();
      } else {
        alert("Błąd przy edycji kursu");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edytuj kurs</h3>
        <input placeholder="ID kursu" value={id} onChange={e => setId(e.target.value)} />
        <input placeholder="Pole do edycji (np. title)" value={field} onChange={e => setField(e.target.value)} />
        <input placeholder="Nowa wartość" value={newValue} onChange={e => setNewValue(e.target.value)} />

        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button guest">Anuluj</button>
          <button onClick={handleEdit} className="modal-button login">Zapisz</button>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
