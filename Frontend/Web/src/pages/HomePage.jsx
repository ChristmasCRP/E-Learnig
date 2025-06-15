import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Karp-Learning</h1>
      <p className="home-description">
        Karp-Learning to otwarty serwis e-learningowy, który umożliwia każdemu
        tworzenie, udostępnianie i korzystanie z kursów edukacyjnych w różnych
        dziedzinach. Ucz się, ucz innych i rozwijaj swoje pasje!
      </p>
      <button className="home-button" onClick={() => navigate("/courses")}>
        Zobacz dostępne kursy
      </button>
    </div>
  );
}

export default HomePage;
