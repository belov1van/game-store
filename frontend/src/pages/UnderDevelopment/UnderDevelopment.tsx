import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer /Footer';
import './UnderDevelopment.css';

const UnderDevelopment: React.FC = () => {
  const handleSearch = (term: string) => {
    console.log('Searching for:', term);
  };

  return (
    <div className="under-dev-container">
      <Header onSearch={handleSearch} />
      
      <main className="under-dev-main">
        <div className="under-dev-content">
          <div className="under-dev-icon">
            <i className="pi pi-cog"></i>
          </div>
          <h1 className="under-dev-title">Page in development</h1>
          <p className="under-dev-description">
            This page is currently under construction. We are working hard to bring you new features and content.
          </p>
          <p className="under-dev-message">
            Please check back later or return to the homepage.
          </p>
          <Link to="/" className="under-dev-btn">
            <i className="pi pi-home" style={{ marginRight: '8px' }}></i>
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnderDevelopment;