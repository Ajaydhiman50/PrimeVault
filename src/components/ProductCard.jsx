import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';

function formatCategory(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const rating = Math.round(product.rating || 0);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-card-image">
          <img src={product.thumbnail} alt={product.title} loading="lazy" />
        </div>
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{formatCategory(product.category)}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-title">{product.title}</h3>
        </Link>
        <div className="product-card-rating">
          <span className="stars">
            {'★'.repeat(rating)}
            {'☆'.repeat(5 - rating)}
          </span>
          <span className="rating-count">({product.rating?.toFixed(1) || '0.0'})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <Button onClick={() => addToCart(product)} variant="primary" size="small">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
