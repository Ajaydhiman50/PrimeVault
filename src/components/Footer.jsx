import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🛒 PrimeVault</h3>
          <p>Your premium shopping destination for quality products at great prices.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li>Electronics</li>
            <li>Clothing</li>
            <li>Home & Kitchen</li>
            <li>Beauty & Health</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>support@primevault.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} PrimeVault. All rights reserved.</p>
      </div>
    </footer>
  );
}
