import React from 'react';
import { Link } from 'react-router-dom';
import './SliderMenu.css';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    { id: 1, name: 'Action', path: '/category/action' },
    { id: 2, name: 'RPG', path: '/category/rpg' },
    { id: 3, name: 'Strategy', path: '/category/strategy' },
    { id: 4, name: 'Sports', path: '/category/sports' },
    { id: 5, name: 'Indie', path: '/category/indie' },
    { id: 6, name: 'Racing', path: '/category/racing' },
    { id: 7, name: 'Simulation', path: '/category/simulation' },
    { id: 8, name: 'Horror', path: '/category/horror' },
  ];

  const popularTags = [
    'New', 'Discounts', 'Popular', 'Coming Soon', 'Free'
  ];

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <div className="sidebar-menu">
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>
        <div className="sidebar-content">
          <div className="menu-section">
            <h3>Game Categories</h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={cat.path} onClick={onClose}>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="menu-section">
            <h3>Popular Tags</h3>
            <div className="tags-list">
              {popularTags.map((tag, idx) => (
                <Link key={idx} to={`/tag/${tag.toLowerCase()}`} className="tag-item" onClick={onClose}>
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="menu-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/about" onClick={onClose}>About Us</Link></li>
              <li><Link to="/support" onClick={onClose}>Support</Link></li>
              <li><Link to="/faq" onClick={onClose}>FAQ</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;