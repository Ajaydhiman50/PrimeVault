import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import Loading from '../components/Loading';
import Button from '../components/Button';

function formatCategory(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [galleryNotif, setGalleryNotif] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
        setReviews(data.reviews || []);
        setCurrentImage(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const relatedProducts = product
    ? products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 6)
    : [];

  function showGalleryNotif(msg) {
    setGalleryNotif(msg);
    setTimeout(() => setGalleryNotif(''), 2000);
  }

  function prevImage() {
    const total = product.images?.length || 1;
    if (total <= 1) {
      showGalleryNotif('No more images');
      return;
    }
    setCurrentImage(prev => (prev === 0 ? total - 1 : prev - 1));
  }

  function nextImage() {
    const total = product.images?.length || 1;
    if (total <= 1) {
      showGalleryNotif('No more images');
      return;
    }
    setCurrentImage(prev => (prev === total - 1 ? 0 : prev + 1));
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    const newReview = {
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      reviewerName: reviewForm.name,
      date: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
    setReviewForm({ name: '', rating: 5, comment: '' });
  }

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  if (!product) return null;

  const rating = Math.round(product.rating || 0);
  const stars = '★'.repeat(rating);
  const emptyStars = '☆'.repeat(5 - rating);
  const images = product.images?.length > 0 ? product.images : [product.thumbnail];
  const discount = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="product-details-page">
      <Button onClick={() => navigate(-1)} variant="secondary" size="small">
        ← Back
      </Button>

      <div className="product-details">
        <div className="product-details-image-section">
          <div className="product-details-image">
            <button className="gallery-nav gallery-prev" onClick={prevImage} aria-label="Previous image">&#8249;</button>
            <img src={images[currentImage]} alt={`${product.title} - image ${currentImage + 1}`} />
            <button className="gallery-nav gallery-next" onClick={nextImage} aria-label="Next image">&#8250;</button>
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${i === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(i)}
                >
                  <img src={img} alt={`${product.title} thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
          {galleryNotif && <div className="gallery-notif">{galleryNotif}</div>}
        </div>

        <div className="product-details-info">
          <span className="product-details-category">{formatCategory(product.category)}</span>
          <h1>{product.title}</h1>

          <div className="product-details-rating">
            <span className="stars">{stars}{emptyStars}</span>
            <span className="rating-text">
              {product.rating?.toFixed(1) || '0.0'} ({product.stock || 0} in stock)
            </span>
          </div>

          {product.brand && (
            <p className="product-details-brand">Brand: {product.brand}</p>
          )}

          <p className="product-details-price">
            {discount ? (
              <>
                <span className="original-price">${discount}</span>
                <span className="current-price">${product.price.toFixed(2)}</span>
                <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span>
              </>
            ) : (
              `$${product.price.toFixed(2)}`
            )}
          </p>

          <p className="product-details-description">{product.description}</p>

          <div className="product-details-meta">
            {product.tags?.length > 0 && (
              <div className="meta-row">
                <span className="meta-label">Tags:</span>
                <div className="tags-list">
                  {product.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            {product.sku && (
              <div className="meta-row">
                <span className="meta-label">SKU:</span>
                <span>{product.sku}</span>
              </div>
            )}
            {product.weight && (
              <div className="meta-row">
                <span className="meta-label">Weight:</span>
                <span>{product.weight}g</span>
              </div>
            )}
            {product.dimensions && (
              <div className="meta-row">
                <span className="meta-label">Dimensions:</span>
                <span>{product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm</span>
              </div>
            )}
            {product.availabilityStatus && (
              <div className="meta-row">
                <span className="meta-label">Availability:</span>
                <span className={`availability ${product.availabilityStatus === 'In Stock' ? 'in-stock' : 'low-stock'}`}>
                  {product.availabilityStatus}
                </span>
              </div>
            )}
            {product.minimumOrderQuantity && (
              <div className="meta-row">
                <span className="meta-label">Min Order:</span>
                <span>{product.minimumOrderQuantity} units</span>
              </div>
            )}
          </div>

          <div className="product-details-policies">
            {product.warrantyInformation && (
              <div className="policy">
                <span className="policy-icon">&#128737;</span>
                <span>{product.warrantyInformation}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="policy">
                <span className="policy-icon">&#128666;</span>
                <span>{product.shippingInformation}</span>
              </div>
            )}
            {product.returnPolicy && (
              <div className="policy">
                <span className="policy-icon">&#128260;</span>
                <span>{product.returnPolicy}</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => { addToCart(product); }}
            variant="primary"
            size="large"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="suggested-products">
          <h2>Related Products</h2>
          <div className="suggested-products-grid">
            {relatedProducts.map(rp => (
              <Link to={`/product/${rp.id}`} key={rp.id} className="suggested-product-card">
                <div className="suggested-product-image">
                  <img src={rp.thumbnail} alt={rp.title} loading="lazy" />
                </div>
                <div className="suggested-product-body">
                  <span className="suggested-product-category">{formatCategory(rp.category)}</span>
                  <h3 className="suggested-product-title">{rp.title}</h3>
                  <div className="suggested-product-footer">
                    <span className="suggested-product-price">${rp.price.toFixed(2)}</span>
                    <span className="suggested-product-rating">
                      {'★'.repeat(Math.round(rp.rating || 0))}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="product-reviews-section">
        <h2>Customer Reviews ({reviews.length})</h2>

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Write a Review</h3>
          <div className="review-form-row">
            <div className="form-group">
              <label htmlFor="reviewName">Your Name</label>
              <input
                id="reviewName"
                type="text"
                value={reviewForm.name}
                onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reviewRating">Rating</label>
              <select
                id="reviewRating"
                value={reviewForm.rating}
                onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reviewComment">Comment</label>
            <textarea
              id="reviewComment"
              value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Share your thoughts about this product..."
              rows="3"
              required
            />
          </div>
          <Button type="submit" variant="primary" size="medium">Submit Review</Button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="reviewer-avatar">
                    {review.reviewerName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="reviewer-info">
                    <strong>{review.reviewerName || 'Anonymous'}</strong>
                    <span className="review-date">
                      {review.date ? new Date(review.date).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="review-stars">
                    {'★'.repeat(review.rating || 0)}
                    {'☆'.repeat(5 - (review.rating || 0))}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
