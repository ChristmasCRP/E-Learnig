import React, { useState, useEffect } from "react";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLogin("");
      setPassword("");
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleLogin = async (customLogin, customPassword) => {
    const user = {
      username: customLogin ?? login,
      password: customPassword ?? password
    };

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        const result = await response.json();

        if (result.authToken) {
          localStorage.setItem("authToken", result.authToken);
          onLogin(true); // admin
        } else if (result.role === "guest") {
          localStorage.removeItem("authToken");
          onLogin(false); // gość
        } else {
          localStorage.removeItem("authToken");
          onLogin(false);
        }

        onClose();
      } else {
        setErrorMsg("Błędny login lub hasło.");
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      setErrorMsg("Błąd połączenia z serwerem.");
    }
  };

  const loginAsGuest = () => {
    handleLogin("guest", "guest");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <input
          type="text"
          placeholder="Login"
          className="modal-input"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          className="modal-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <div style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</div>}

        <div className="modal-buttons">
          <button onClick={loginAsGuest} className="modal-button guest">
            Kontynuuj jako gość
          </button>
          <button onClick={() => handleLogin()} className="modal-button login">
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
