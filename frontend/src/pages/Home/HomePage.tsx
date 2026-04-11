import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer /Footer';
import GameModal from '../../components/gameModal/GameModal';
import Cart from '../../components/cart/Cart';
import { useCart } from '../../context/CartContext';
import './Home.css';

interface Game {
  id: number;
  title: string;
  image: string;
  price: string;
  rating: number;
  description: string;
  genre: string;
  releaseDate: string;
  developer: string;
}

const HomePage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart } = useCart();

  const emptyGames = Array(24).fill(null);

  const handleSearch = (term: string) => {
    console.log('Searching for:', term);
  };

  const handleBuyClick = (index: number) => {
    const tempGame: Game = {
      id: index,
      title: `Game ${index + 1}`,
      image: 'https://via.placeholder.com/300x400?text=Game',
      price: '$59.99',
      rating: 0,
      description: 'Game description will be available soon. Stay tuned for updates!',
      genre: 'TBA',
      releaseDate: 'Coming Soon',
      developer: 'TBA'
    };
    setSelectedGame(tempGame);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleConfirmBuy = () => {
    if (selectedGame) {
      addToCart({
        id: selectedGame.id,
        title: selectedGame.title,
        price: selectedGame.price,
        image: selectedGame.image,
        quantity: 1
      });
      alert(`${selectedGame.title} added to cart!`);
      setIsModalOpen(false);
      setSelectedGame(null);
    }
  };

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} onCartClick={() => setIsCartOpen(true)} />
      
      <main className="home-main">
        <div className="games-grid">
          {emptyGames.map((_, index) => (
            <div key={index} className="game-card">
              <div className="game-image-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-text">Game {index + 1}</div>
                </div>
              </div>
              <div className="game-info">
                <h3 className="game-title-placeholder">Game Title</h3>
                <div className="game-price-placeholder">$59.99</div>
                <button 
                  className="buy-btn"
                  onClick={() => handleBuyClick(index)}
                >
                  buy now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <GameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        game={selectedGame}
        onBuy={handleConfirmBuy}
      />

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default HomePage;