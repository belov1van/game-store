import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer /Footer";
import "./Home.css";

const HomePage: React.FC = () => {
// Временно на пустых карточках
  const emptyGames = Array(24).fill(null);

  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
  };


  return (
    <div className="home-container">
      <Header onSearch={handleSearch} />

      <main className="home-main">
        <div className="games-grid">
          {emptyGames.map((_, index) => (
            <div key={index} className="game-card">
              <div className="game-image-placeholder">
                <div className="placeholder-content">
                  <div className="game-icon"></div>
                  <div className="placeholder-text">Game {index + 1}</div>
                </div>
              </div>
              <div className="game-info">
                <h3 className="game-title-placeholder">Game Title</h3>
                <div className="game-price-placeholder">$--.--</div>
                <button className="buy-btn">buy now</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
