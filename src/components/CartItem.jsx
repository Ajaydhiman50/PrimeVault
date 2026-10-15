import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.thumbnail} alt={item.title} />
      </div>
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.title}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)}</p>
      </div>
      <div className="cart-item-quantity">
        <button
          className="qty-btn"
          onClick={() => decreaseQuantity(item.id)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => increaseQuantity(item.id)}
          aria-label="Increase quantity"
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
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
