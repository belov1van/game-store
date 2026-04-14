import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/api";
import "primeicons/primeicons.css";
import "./Cart.css";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!isAuthenticated) {
      alert("Please log in to checkout.");
      return;
    }

    try {
      await api.orders.create(
        cartItems.map((item) => ({ gameId: item.id, quantity: item.quantity })),
      );
      alert(`Order placed! Total: $${getTotalPrice().toFixed(2)}`);
      clearCart();
      onClose();
    } catch (err) {
      alert(
        `Checkout failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={handleOverlayClick}>
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">
            <i
              className="pi pi-shopping-cart"
              style={{ marginRight: "10px" }}
            ></i>
            shopping cart
          </h2>
          <button className="cart-close" onClick={onClose}>
            <i className="pi pi-times"></i>
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">
                <i
                  className="pi pi-shopping-cart"
                  style={{ fontSize: "80px" }}
                ></i>
              </div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <div className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-price">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                <i className="pi pi-trash" style={{ marginRight: "8px" }}></i>
                clear cart
              </button>
              <button
                className="checkout-btn"
                onClick={() => {
                  void handleCheckout();
                }}
              >
                <i className="pi pi-check" style={{ marginRight: "8px" }}></i>
                checkout ({getTotalItems()} items)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
