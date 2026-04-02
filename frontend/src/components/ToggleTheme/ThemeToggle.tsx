import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';
import "primeicons/primeicons.css";


const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme} 
      aria-label="Переключить тему"
      title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
    >
      <div className="theme-toggle-icons">
        <span className={`theme-icon sun ${theme === 'light' ? 'active' : 'pi pi-sun '}`}></span>
        <span className={`theme-icon moon ${theme === 'dark' ? 'active' : 'pi pi-moon'}`}></span>
      </div>
      <div className="theme-toggle-slider">
        <div className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : 'light'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;