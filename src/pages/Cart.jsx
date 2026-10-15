import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Button from '../components/Button';

export default function Cart() {
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items yet.</p>
        <Link to="/">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{totalPrice >= 100 ? 'FREE' : '$10.00'}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>
              ${(totalPrice + (totalPrice >= 100 ? 0 : 10)).toFixed(2)}
            </span>
          </div>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
