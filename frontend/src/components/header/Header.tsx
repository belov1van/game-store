import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ToggleTheme/ThemeToggle";
import SidebarMenu from "../sliderMenu/SliderMenu";
import "primeicons/primeicons.css";
import "./Header.css";
import lightLogo from "../../assets/icons/game-controller-svgrepo-com (1).svg";
import darkLogo from "../../assets/icons/game-controller-svgrepo-com white.svg";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onCartClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { getTotalItems } = useCart();
  const { isAdmin } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleLogoClick = () => navigate("/");

  const logoSrc = theme === "dark" ? darkLogo : lightLogo;
  const totalItems = getTotalItems();

  return (
    <>
      <header className="home-header">
        <div className="header-content">
          <div
            className="logo"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
          >
            <div className="logo-icon">
              <img src={logoSrc} alt="logo" className="login-icon" />
            </div>
            <span className="logo-text">Gamestore</span>
          </div>

          <nav className="main-nav">
            <button
              className="nav-link menu-button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Sidebar Menu"
            >
              <i className="pi pi-bars nav-icon"></i>
              <span>Menu</span>
            </button>
            <Link to="/library" className="nav-link">
              <i className="pi pi-book nav-icon"></i>
              <span>Library</span>
            </Link>
            <Link to="/about" className="nav-link">
              <i className="pi pi-info-circle nav-icon"></i>
              <span>About Us</span>
            </Link>
            <Link to="/settings" className="nav-link">
              <i className="pi pi-cog nav-icon"></i>
              <span>Settings</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link">
                <i className="pi pi-shield nav-icon"></i>
                <span>admin</span>
              </Link>
            )}
          </nav>

          <div className="search-section">
            <div className="search-bar">
              <i className="pi pi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search Games"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <ThemeToggle />
          <button className="cart-btn" onClick={onCartClick}>
            <i className="pi pi-shopping-cart cart-icon"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <Link to="/profile" className="user-profile-btn">
            <i className="pi pi-user user-icon"></i>
            <span>UserProfile</span>
          </Link>
        </div>
      </header>
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
