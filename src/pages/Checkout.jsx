import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',
};

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Invalid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.pinCode.trim()) newErrors.pinCode = 'PIN code is required';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  }

  function handlePlaceOrder() {
    clearCart();
    navigate('/');
  }

  if (!cart.length && !submitted) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some items before checking out.</p>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="order-success">
        <div className="success-icon">🎉</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase, {form.fullName}!</p>
        <div className="order-details">
          <h3>Order Summary</h3>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Shipping to:</strong> {form.address}, {form.city}, {form.state} - {form.pinCode}</p>
          <p><strong>Total Paid:</strong> ${(totalPrice + (totalPrice >= 100 ? 0 : 10)).toFixed(2)}</p>
        </div>
        <Button onClick={handlePlaceOrder}>Continue Shopping</Button>
      </div>
    );
  }

  const shipping = totalPrice >= 100 ? 0 : 10;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main Street"
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="New York"
              />
              {errors.city && <span className="form-error">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="NY"
              />
              {errors.state && <span className="form-error">{errors.state}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="pinCode">PIN Code</label>
              <input
                id="pinCode"
                name="pinCode"
                value={form.pinCode}
                onChange={handleChange}
                placeholder="10001"
              />
              {errors.pinCode && <span className="form-error">{errors.pinCode}</span>}
            </div>
          </div>

          <Button type="submit" variant="primary" size="large">
            Review Order
          </Button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-image">
                <img src={item.thumbnail} alt={item.title} />
              </div>
              <div className="checkout-item-details">
                <p className="checkout-item-title">{item.title.substring(0, 40)}...</p>
                <p className="checkout-item-qty">Qty: {item.quantity}</p>
              </div>
              <div className="checkout-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="checkout-summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${(totalPrice + shipping).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
