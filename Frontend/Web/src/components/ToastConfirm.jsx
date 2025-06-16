import React from "react";
import "./ToastConfirm.css";

function ToastConfirm({ visible, message, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className={`toast-confirm ${visible ? "show" : ""}`}>
      <p>{message}</p>
      <div className="toast-confirm-buttons">
        <button className="confirm" onClick={onConfirm}>Tak, usuń</button>
        <button className="cancel" onClick={onCancel}>Anuluj</button>
      </div>
    </div>
  );
}

export default ToastConfirm;
