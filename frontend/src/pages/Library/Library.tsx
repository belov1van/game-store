import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer /Footer";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../api/api";
import type { Order } from "../../api/types";
import "./Library.css";

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [openCodeItemId, setOpenCodeItemId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.users.orders();
      setOrders(data);
      showToast("Library updated successfully", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load";
      setLoadError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    void loadOrders();
  }, [isAuthenticated, navigate, loadOrders]);

  const items = useMemo(
    () =>
      orders.flatMap((o) =>
        o.items.map((it) => ({
          id: it.id,
          title: it.game.title,
          image: it.game.image,
          price: it.price,
          quantity: it.quantity,
          code: it.code,
          orderId: o.id,
          orderDate: o.createdAt,
        })),
      ),
    [orders],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.code?.toLowerCase().includes(q) ||
        String(i.orderId).includes(q),
    );
  }, [items, search]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const handleCopy = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast(`Key for "${title}" copied to clipboard`, "success");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(`Key for "${title}" copied to clipboard`, "success");
    }
  };

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleRefresh = () => {
    void loadOrders();
  };

  return (
    <div className="library-container">
      <Header onSearch={handleSearch} />

      <main className="library-main">
        <div className="library-card">
          <div className="library-header-row">
            <h2 className="library-heading">your library</h2>
            <button
              className="library-btn library-btn-muted"
              onClick={handleRefresh}
            >
              refresh
            </button>
          </div>

          <div className="library-search">
            <input
              type="text"
              placeholder="search by title, code, or order id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="library-input"
            />
          </div>

          {loading && (
            <div className="library-loading">Loading your purchases...</div>
          )}
          {!loading && loadError && (
            <div className="library-error">{loadError}</div>
          )}
          {!loading && !loadError && filtered.length === 0 && (
            <div className="library-empty">
              {items.length === 0
                ? "You don't have any purchased games yet."
                : "No results found for your search."}
            </div>
          )}

          {!loading && !loadError && filtered.length > 0 && (
            <div className="library-list">
              {filtered.map((it) => (
                <div key={`${it.id}`} className="library-item">
                  <img
                    src={it.image}
                    alt={it.title}
                    className="library-image"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x140?text=No+Image';
                    }}
                  />
                  <div className="library-title">{it.title}</div>
                  <div className="library-meta">
                    order #{it.orderId} • {formatDate(it.orderDate)}
                  </div>
                  <div className="library-meta">
                    ${it.price.toFixed(2)} × {it.quantity}
                  </div>

                  <button
                    className="library-btn"
                    onClick={() => {
                      setOpenCodeItemId(
                        openCodeItemId === it.id ? null : it.id,
                      );
                    }}
                  >
                    details
                  </button>
                  {openCodeItemId === it.id &&
                    (it.code ? (
                      <div className="library-code">
                        <span className="library-code-text">{it.code}</span>
                        <button
                          className="library-btn"
                          onClick={() => {
                            void handleCopy(it.code, it.title);
                          }}
                        >
                          copy
                        </button>
                      </div>
                    ) : (
                      <div className="library-code pending">
                        <span className="library-code-placeholder">
                          key will appear here after purchase is processed
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;