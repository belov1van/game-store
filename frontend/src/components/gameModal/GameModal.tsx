import 'primeicons/primeicons.css';
import './GameModal.css';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    id: number;
    title: string;
    price: string;
    description: string;
    image: string;
    rating: number;
    genre: string;
    releaseDate: string;
    developer: string;
  } | null;
  onBuy: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose, game, onBuy }) => {
  if (!isOpen || !game) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBuyClick = () => {
    onBuy();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <i className="pi pi-times"></i>
        </button>
        
        <div className="modal-body">
          <div className="modal-image">
            <img src={game.image} alt={game.title} />
            {game.rating > 0 && (
              <div className="modal-rating">
                <i className="pi pi-star-fill" style={{ fontSize: '12px', marginRight: '5px' }}></i>
                {game.rating}
              </div>
            )}
          </div>
          
          <div className="modal-info">
            <h2 className="modal-title">{game.title}</h2>
            
            <div className="modal-details">
              <div className="detail-item">
                <span className="detail-label">
                  <i className="pi pi-tag" style={{ marginRight: '8px' }}></i>
                  Genre:
                </span>
                <span className="detail-value">{game.genre}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <i className="pi pi-code" style={{ marginRight: '8px' }}></i>
                  Developer:
                </span>
                <span className="detail-value">{game.developer}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <i className="pi pi-calendar" style={{ marginRight: '8px' }}></i>
                  Release Date:
                </span>
                <span className="detail-value">{game.releaseDate}</span>
              </div>
            </div>
            
            <p className="modal-description">{game.description}</p>
            
            <div className="modal-footer">
              <div className="modal-price">{game.price}</div>
              <button className="modal-buy-btn" onClick={handleBuyClick}>
                <i className="pi pi-shopping-cart" style={{ marginRight: '8px' }}></i>
                buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;