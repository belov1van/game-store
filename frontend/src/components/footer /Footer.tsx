import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Footer.css";
import lightLogo from "../../assets/icons/game-controller-svgrepo-com (1).svg";
import darkLogo from "../../assets/icons/game-controller-svgrepo-com white.svg";

const Footer: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { theme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // Здесь будет логика поиска
    }
  };

  const logoSrc = theme === "dark" ? darkLogo : lightLogo;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={logoSrc} alt="logo" className="footer-logo-icon" />
              <span className="logo-text">Gamestore</span>
            </div>
            <p className="footer-description">
              Your ultimate destination for discovering and purchasing the best
              games. Join our community of passionate gamers!
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">about us</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about">Frontend</Link>
              </li>
              <li>
                <Link to="/about">Backend</Link>
              </li>
              <li>
                <Link to="/about">DevOps</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Git Hub</h3>
            <ul className="footer-links">
              <li>
                <a
                  href="https://github.com/Dzh1224/game-store"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  repository
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">developers</h3>
            <ul className="footer-links">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  support
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">search game</h3>
            <form onSubmit={handleSearch} className="footer-search">
              <input
                type="text"
                placeholder="search game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">2025-2026 GAME STORE. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
