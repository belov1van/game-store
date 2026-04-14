import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../api/api";
import "./SliderMenu.css";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}


const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const activeGenre = searchParams.get("genre") ?? "";

  useEffect(() => {
    if (!isOpen) return;
    //setLoading(true);
    //setError(null);
    api.games
      .genres()
      .then(setGenres)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <div className="sidebar-menu">
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-content">
          <div className="menu-section">
            <h3>Game Categories</h3>

            {loading && (
              <p
                style={{ padding: "8px 12px", opacity: 0.6, fontSize: "14px" }}
              >
                Loading…
              </p>
            )}

            {error && (
              <p
                style={{ padding: "8px 12px", color: "red", fontSize: "14px" }}
              >
                {error}
              </p>
            )}

            {!loading && !error && (
              <ul className="category-list">
                <li>
                  <Link
                    to="/"
                    onClick={onClose}
                    style={
                      activeGenre === ""
                        ? { color: "#667eea", fontWeight: 600 }
                        : undefined
                    }
                  >
                    <span>All games</span>
                  </Link>
                </li>

                {genres.map((genre) => (
                  <li key={genre}>
                    <Link
                      to={`/?genre=${encodeURIComponent(genre)}`}
                      onClick={onClose}
                      style={
                        activeGenre === genre
                          ? { color: "#667eea", fontWeight: 600 }
                          : undefined
                      }
                    >
                      <span className="cat-icon">{}</span>
                      <span>{genre}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="menu-section">
            <h3>About</h3>
            <ul>
              <li>
                <Link to="/about" onClick={onClose}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" onClick={onClose}>
                  Support
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={onClose}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
