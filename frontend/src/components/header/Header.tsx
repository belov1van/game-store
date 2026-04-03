import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ToggleTheme/ThemeToggle";
import "./Header.css";
import logoSvg from "../../assets/icons/game-controller-svgrepo-com (1).svg";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="home-header">
      <div className="header-content">
        <div
          className="logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleLogoClick();
            }
          }}
        >
          <div className="logo-icon">
            <img
              src={logoSvg}
              alt="logo"
              className={`login-icon ${
                theme === "dark" ? "dark-theme-icon" : ""
              }`}
            />
          </div>
          <span className="logo-text">Gamestore</span>
        </div>

        <nav className="main-nav">
          <Link to="/menu" className="nav-link">
            <img
              src={"../src/assets/icons/menu-svgrepo-com.svg"}
              alt="menu"
              className="nav-icon"
            />
            <span>menu</span>
          </Link>
          <Link to="/library" className="nav-link">
            <img
              src={"../src/assets/icons/lib-icon.svg"}
              alt="library"
              className="nav-icon"
            />
            <span>library</span>
          </Link>
          <Link to="/about" className="nav-link">
            <img
              src={"../src/assets/icons/about-us.svg"}
              alt="about us"
              className="nav-icon"
            />
            <span>about us</span>
          </Link>
          <Link to="/settings" className="nav-link">
            <img
              src={"../src/assets/icons/settings.svg"}
              alt="settings"
              className="nav-icon"
            />
            <span>settings</span>
          </Link>
        </nav>

        <div className="search-section">
          <div className="search-bar">
            <img
              src={"../src/assets/icons/search-icon.svg"}
              alt="search"
              className="search-icon"
            />
            <input
              type="text"
              placeholder="search game"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <ThemeToggle />

        <Link to="/profile" className="user-profile-btn">
          <span>profile</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
