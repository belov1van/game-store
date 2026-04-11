import { useTheme } from '../../context/ThemeContext';
import 'primeicons/primeicons.css';
import './ThemeToggle.css';

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
        <i className={`pi pi-sun theme-icon ${theme === 'light' ? 'active' : ''}`}></i>
        <i className={`pi pi-moon theme-icon ${theme === 'dark' ? 'active' : ''}`}></i>
      </div>
      <div className="theme-toggle-slider">
        <div className={`theme-toggle-thumb ${theme === 'dark' ? 'dark' : 'light'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;