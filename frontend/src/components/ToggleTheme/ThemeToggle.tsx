import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";
import "primeicons/primeicons.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Переключить тему"
      title={
        theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"
      }
    >
      <div className="theme-toggle-icons">
        <i
          className={`theme-icon sun pi pi-sun ${
            theme === "light" ? "active" : ""
          }`}
        ></i>
        <i
          className={`theme-icon moon pi pi-moon ${
            theme === "dark" ? "active" : ""
          }`}
        ></i>
      </div>
      <div className="theme-toggle-slider">
        <div
          className={`theme-toggle-thumb ${
            theme === "dark" ? "dark" : "light"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
