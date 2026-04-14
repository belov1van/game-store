import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer /Footer";
import GameModal from "../../components/gameModal/GameModal";
import Cart from "../../components/cart/Cart";
import { useCart } from "../../context/CartContext";
import { api } from "../../api/api";
import type { Game } from "../../api/types";
import "./Home.css";

const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const activeGenre = searchParams.get("genre") ?? "";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart } = useCart();

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.games.list({
        search: search || undefined,
        genre: activeGenre || undefined,
        page,
        limit: 12,
      });
      setGames(data.games);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load games");
    } finally {
      setLoading(false);
    }
  }, [search, page, activeGenre]);

  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    setPage(1);
  }, [search, activeGenre]);

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
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
        quantity: 1,
      });
      setIsModalOpen(false);
      setSelectedGame(null);
    }
  };

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} onCartClick={() => setIsCartOpen(true)} />

      <main className="home-main">
        {activeGenre && (
          <div
            style={{ padding: "16px 24px 0", fontSize: "14px", opacity: 0.6 }}
          >
            Genre: <strong>{activeGenre}</strong>
          </div>
        )}
        {loading && (
          <div
            style={{ textAlign: "center", padding: "60px", fontSize: "18px" }}
          >
            Loading games...
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "60px", color: "red" }}>
            {error}
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px" }}>
            No games found.
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <div className="games-grid">
              {games.map((game) => (
                <div key={game.id} className="game-card">
                  <div className="game-image-placeholder">
                    <img
                      src={game.image}
                      alt={game.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="game-info">
                    <h3 className="game-title-placeholder">{game.title}</h3>
                    <div className="game-price-placeholder">
                      ${game.price.toFixed(2)}
                    </div>
                    <button
                      className="buy-btn"
                      onClick={() => handleGameClick(game)}
                    >
                      buy now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "24px",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="buy-btn"
                >
                  ← prev
                </button>
                <span style={{ alignSelf: "center" }}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="buy-btn"
                >
                  next →
                </button>
              </div>
            )}
          </>
        )}
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
